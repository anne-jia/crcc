import defaultSettings from '@/settings'

const title = defaultSettings.title || '中国铁建电采管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
