import { RepoContext, RepoMetadata } from '../types';

const BASE_URL = 'https://api.github.com';

// Helper to handle API limits or auth
const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch (e) {
    return null;
  }
};

export const fetchRepoData = async (
  owner: string, 
  repo: string, 
  token?: string,
  onProgress?: (message: string) => void
): Promise<RepoContext> => {
  const headers = getHeaders(token);
  
  onProgress?.(`Connecting to GitHub API for ${owner}/${repo}...`);

  // 1. Fetch Basic Metadata
  const metaRes = await fetch(`${BASE_URL}/repos/${owner}/${repo}`, { headers });
  if (!metaRes.ok) {
    if (metaRes.status === 404) throw new Error('Repository not found (or private).');
    if (metaRes.status === 403 || metaRes.status === 429) throw new Error('GitHub API rate limit exceeded. Please try again later or provide a token.');
    throw new Error('Failed to fetch repository metadata.');
  }
  const metadata: RepoMetadata = await metaRes.json();
  onProgress?.('Repository metadata retrieved successfully.');

  // 2. Fetch Languages
  onProgress?.('Analyzing language distribution...');
  const langRes = await fetch(`${BASE_URL}/repos/${owner}/${repo}/languages`, { headers });
  const languages = langRes.ok ? await langRes.json() : {};
  onProgress?.(`Identified languages: ${Object.keys(languages).slice(0, 3).join(', ')}${Object.keys(languages).length > 3 ? '...' : ''}`);

  // 3. Fetch README
  let readmeContent: string | null = null;
  try {
    onProgress?.('Fetching README.md documentation...');
    const readmeRes = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      // content is base64 encoded
      readmeContent = atob(readmeData.content);
      onProgress?.('README content loaded.');
    } else {
      onProgress?.('No README found, skipping.');
    }
  } catch (e) {
    console.warn("Could not fetch README", e);
    onProgress?.('Failed to fetch README (non-fatal).');
  }

  // 4. Fetch File Tree (Truncated for context limit)
  // We use the git/trees API to get a recursive tree
  let files: string[] = [];
  let packageJsonContent: string | null = null;
  
  try {
    onProgress?.(`Mapping file structure for branch: ${metadata.default_branch}...`);
    const treeRes = await fetch(`${BASE_URL}/repos/${owner}/${repo}/git/trees/${metadata.default_branch}?recursive=1`, { headers });
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      // Filter to max 200 files to avoid massive prompts, prioritize root and depth 1-2
      files = treeData.tree.map((node: any) => node.path);
      onProgress?.(`Mapped ${files.length} files in repository.`);
      
      // Try to find package.json or similar dependency file URL from the tree
      const pkgJsonNode = treeData.tree.find((node: any) => node.path === 'package.json');
      if (pkgJsonNode && pkgJsonNode.url) {
         onProgress?.('Found package.json, retrieving dependency list...');
         const pkgRes = await fetch(pkgJsonNode.url, { headers });
         if (pkgRes.ok) {
            const pkgData = await pkgRes.json();
            packageJsonContent = atob(pkgData.content);
         }
      }
    }
  } catch (e) {
    console.warn("Could not fetch file tree", e);
    onProgress?.('Could not map full file tree (non-fatal).');
  }

  return {
    metadata,
    files,
    readmeContent,
    packageJsonContent,
    languages
  };
};