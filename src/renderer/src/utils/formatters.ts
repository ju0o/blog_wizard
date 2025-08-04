import { BlogPost, FormatResult, PlatformConfig } from '../types';

// 티스토리 포맷 변환
export const formatForTistory = (post: BlogPost, config: PlatformConfig['tistory']): FormatResult => {
  try {
    // 티스토리 API 형식에 맞게 변환
    const tistoryPost = {
      title: post.title,
      content: post.content,
      visibility: post.status === 'published' ? 3 : 0, // 3: 발행, 0: 비공개
      categoryId: config.categoryId || '',
      tag: post.tags.join(','),
      acceptComment: 1,
      password: '',
      secondaryUrl: '',
      secret: 0,
      slogan: '',
      useCategory: 1,
    };

    return {
      platform: 'tistory',
      content: JSON.stringify(tistoryPost),
      metadata: {
        blogName: config.blogName,
        accessToken: config.accessToken,
      },
      success: true,
    };
  } catch (error) {
    return {
      platform: 'tistory',
      content: '',
      metadata: {},
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// 네이버 블로그 포맷 변환
export const formatForNaver = (post: BlogPost, config: PlatformConfig['naver']): FormatResult => {
  try {
    // 네이버 블로그 API 형식에 맞게 변환
    const naverPost = {
      title: post.title,
      contents: post.content,
      categoryNo: '', // 카테고리 번호
      publishType: post.status === 'published' ? 'PUBLISH' : 'DRAFT',
      tag: post.tags.join(','),
      publishDate: post.publishedAt || new Date().toISOString(),
    };

    return {
      platform: 'naver',
      content: JSON.stringify(naverPost),
      metadata: {
        blogId: config.blogId,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      },
      success: true,
    };
  } catch (error) {
    return {
      platform: 'naver',
      content: '',
      metadata: {},
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// 커스텀 포맷 변환 (마크다운)
export const formatForCustom = (post: BlogPost): FormatResult => {
  try {
    // 마크다운 형식으로 변환
    const markdownContent = `
# ${post.title}

${post.excerpt ? `> ${post.excerpt}\n` : ''}

${post.content.replace(/<[^>]*>/g, '')}

${post.tags.length > 0 ? `\n**태그:** ${post.tags.join(', ')}` : ''}
${post.category ? `\n**카테고리:** ${post.category}` : ''}

---
*작성일: ${new Date(post.createdAt).toLocaleDateString('ko-KR')}*
${post.publishedAt ? `*발행일: ${new Date(post.publishedAt).toLocaleDateString('ko-KR')}*` : ''}
    `.trim();

    return {
      platform: 'custom',
      content: markdownContent,
      metadata: {
        title: post.title,
        tags: post.tags,
        category: post.category,
        status: post.status,
      },
      success: true,
    };
  } catch (error) {
    return {
      platform: 'custom',
      content: '',
      metadata: {},
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// HTML을 플랫폼별로 변환
export const convertHtmlForPlatform = (html: string, platform: 'tistory' | 'naver' | 'custom'): string => {
  switch (platform) {
    case 'tistory':
      // 티스토리는 HTML을 그대로 사용
      return html;
    
    case 'naver':
      // 네이버는 일부 태그를 변환
      return html
        .replace(/<h1>/g, '<h2>')
        .replace(/<\/h1>/g, '</h2>')
        .replace(/<blockquote>/g, '<div style="border-left: 4px solid #ccc; padding-left: 1em; margin: 1em 0;">')
        .replace(/<\/blockquote>/g, '</div>');
    
    case 'custom':
      // 커스텀은 마크다운으로 변환
      return html
        .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1')
        .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1')
        .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1')
        .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
        .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
        .replace(/<pre[^>]*>(.*?)<\/pre>/g, '```\n$1\n```')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)')
        .replace(/<[^>]*>/g, '');
    
    default:
      return html;
  }
};

// 플랫폼별 설정 검증
export const validatePlatformConfig = (platform: 'tistory' | 'naver', config: any): boolean => {
  switch (platform) {
    case 'tistory':
      return !!(config.accessToken && config.blogName);
    
    case 'naver':
      return !!(config.clientId && config.clientSecret && config.blogId);
    
    default:
      return false;
  }
};