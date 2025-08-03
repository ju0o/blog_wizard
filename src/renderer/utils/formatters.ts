// src/renderer/utils/formatters.ts

export function getTistoryFormat(title: string, body: string): string {
  // 티스토리용 HTML 변환(간단 예시, 필요시 확장)
  return `<h1>${title}</h1>\n<p>${body.replace(/\n/g, '<br/>')}</p>`;
}

export function getNaverFormat(title: string, body: string): string {
  // 네이버용 포맷(여기선 비슷, 나중에 더 복잡하게 가능)
  return `<b>${title}</b>\n${body}`;
}
