import { NextRequest, NextResponse } from 'next/server';

<<<<<<< HEAD
=======
import { resolveAdultFilter } from '@/lib/adult-filter';
>>>>>>> upstream/main
import { getAuthInfoFromCookie } from '@/lib/auth';
import { getAvailableApiSites, getCacheTime, getConfig } from '@/lib/config';
import { searchFromApi } from '@/lib/downstream';
import { yellowWords } from '@/lib/yellow';

export const runtime = 'nodejs';

// OrionTV 兼容接口
export async function GET(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const resourceId = searchParams.get('resourceId');

  if (!query || !resourceId) {
    const cacheTime = await getCacheTime();
    return NextResponse.json(
      { result: null, error: '缺少必要参数: q 或 resourceId' },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
          'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
          'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
          'Netlify-Vary': 'query',
        },
      }
    );
  }

  const config = await getConfig();
<<<<<<< HEAD
  const apiSites = await getAvailableApiSites(authInfo.username);
=======
  let apiSites = await getAvailableApiSites(authInfo.username);

  const shouldFilterAdult = resolveAdultFilter(
    searchParams,
    config.SiteConfig.DisableYellowFilter
  );

  if (shouldFilterAdult) {
    apiSites = apiSites.filter((site) => !site.is_adult);
  }
>>>>>>> upstream/main

  try {
    // 根据 resourceId 查找对应的 API 站点
    const targetSite = apiSites.find((site) => site.key === resourceId);
    if (!targetSite) {
      return NextResponse.json(
        {
          error: `未找到指定的视频源: ${resourceId}`,
          result: null,
        },
<<<<<<< HEAD
        { status: 404 }
=======
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Cookie',
            'X-Adult-Filter': shouldFilterAdult ? 'enabled' : 'disabled',
          },
        }
>>>>>>> upstream/main
      );
    }

    const results = await searchFromApi(targetSite, query);
    let result = results.filter((r) => r.title === query);

<<<<<<< HEAD
    // 成人内容过滤
    if (!config.SiteConfig.DisableYellowFilter) {
      result = result.filter((r) => {
        const typeName = r.type_name || '';
        // 检查源是否标记为成人资源
        if (targetSite.is_adult) {
          return false;
        }
        // 检查分类名称关键词
=======
    if (shouldFilterAdult) {
      result = result.filter((r) => {
        const typeName = r.type_name || '';
        if (targetSite.is_adult) {
          return false;
        }
>>>>>>> upstream/main
        return !yellowWords.some((word: string) => typeName.includes(word));
      });
    }
    const cacheTime = await getCacheTime();

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: '未找到结果',
          result: null,
        },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Cookie',
<<<<<<< HEAD
=======
            'X-Adult-Filter': shouldFilterAdult ? 'enabled' : 'disabled',
>>>>>>> upstream/main
          },
        }
      );
    } else {
      return NextResponse.json(
        { results: result },
        {
          headers: {
            'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
            'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
            'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
            'Netlify-Vary': 'query',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Cookie',
<<<<<<< HEAD
=======
            'X-Adult-Filter': shouldFilterAdult ? 'enabled' : 'disabled',
>>>>>>> upstream/main
          },
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: '搜索失败',
        result: null,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Cookie',
<<<<<<< HEAD
=======
          'X-Adult-Filter': shouldFilterAdult ? 'enabled' : 'disabled',
>>>>>>> upstream/main
        },
      }
    );
  }
}

// CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
      'Access-Control-Max-Age': '86400',
    },
  });
}
