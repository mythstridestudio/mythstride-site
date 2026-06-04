const productionBasePath = '/mythstride-site';

function getBasePath() {
  const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const basePath = configuredBasePath || (process.env.NODE_ENV === 'production' ? productionBasePath : '');

  return basePath.replace(/\/$/, '');
}

export function getAssetPath(path: string) {
  if (!path || path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = getBasePath();

  if (basePath && normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
}
