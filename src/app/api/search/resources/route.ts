/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

<<<<<<< HEAD
=======
import { resolveAdultFilter } from '@/lib/adult-filter';
>>>>>>> upstream/main
import { getAuthInfoFromCookie } from '@/lib/auth';
import { getAvailableApiSites, getConfig } from '@/lib/config';

export const runtime = 'nodejs';

// OrionTV 兼容接口 - 获取可用的视频源列表
export async function GET(request: NextRequest) {
  const authInfo = getAuthInfoFromCookie(request);
  if (!authInfo || !authInfo.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const config = await getAvailableApiSites(authInfo.username);
    const globalConfig = await getConfig();

<<<<<<< HEAD
    let apiSites = config;

    // 🔒 成人内容过滤逻辑
    // URL 参数优先级: ?adult=1 (显示成人) > ?filter=off (显示成人) > 全局配置
    const adultParam = searchParams.get('adult'); // OrionTV 风格参数
    const filterParam = searchParams.get('filter'); // TVBox 风格参数

    let shouldFilterAdult = !globalConfig.SiteConfig.DisableYellowFilter; // 默认使用全局配置

    // URL 参数覆盖全局配置
    if (adultParam === '1' || adultParam === 'true') {
      shouldFilterAdult = false; // 显式启用成人内容
    } else if (adultParam === '0' || adultParam === 'false') {
      shouldFilterAdult = true; // 显式禁用成人内容
    } else if (filterParam === 'off' || filterParam === 'disable') {
      shouldFilterAdult = false; // 禁用过滤 = 显示成人内容
    } else if (filterParam === 'on' || filterParam === 'enable') {
      shouldFilterAdult = true; // 启用过滤 = 隐藏成人内容
    }

    // 应用过滤
    if (shouldFilterAdult) {
      apiSites = apiSites.filter((site) => !site.is_adult);
    }
=======
    const shouldFilterAdult = resolveAdultFilter(
      searchParams,
      globalConfig.SiteConfig.DisableYellowFilter
    );

    const apiSites = shouldFilterAdult
      ? config.filter((site) => !site.is_adult)
      : config;
>>>>>>> upstream/main

    return NextResponse.json(apiSites, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Cookie',
        'X-Adult-Filter': shouldFilterAdult ? 'enabled' : 'disabled', // 调试信息
      },
    });
  } catch (error) {
    return NextResponse.json({ error: '获取资源失败' }, { status: 500 });
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
