import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { BlogPost, FormatResult, PlatformConfig } from '../../types';
import { formatForTistory, formatForNaver, formatForCustom, validatePlatformConfig } from '../../utils/formatters';
import { copyToClipboard } from '../../utils';
import { Copy, Download, Eye, Settings } from 'lucide-react';

interface FormatterProps {
  post: BlogPost;
  platformConfig: PlatformConfig;
}

export const Formatter: React.FC<FormatterProps> = ({
  post,
  platformConfig,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'tistory' | 'naver' | 'custom'>('tistory');
  const [formattedResult, setFormattedResult] = useState<FormatResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState(platformConfig);

  const formatPost = useCallback(() => {
    let result: FormatResult;

    switch (selectedPlatform) {
      case 'tistory':
        if (!validatePlatformConfig('tistory', config.tistory)) {
          alert('티스토리 설정이 올바르지 않습니다. 설정을 확인해주세요.');
          return;
        }
        result = formatForTistory(post, config.tistory);
        break;
      
      case 'naver':
        if (!validatePlatformConfig('naver', config.naver)) {
          alert('네이버 설정이 올바르지 않습니다. 설정을 확인해주세요.');
          return;
        }
        result = formatForNaver(post, config.naver);
        break;
      
      case 'custom':
        result = formatForCustom(post);
        break;
      
      default:
        return;
    }

    setFormattedResult(result);
  }, [post, selectedPlatform, config]);

  const handleCopy = useCallback(async () => {
    if (formattedResult) {
      const success = await copyToClipboard(formattedResult.content);
      if (success) {
        alert('클립보드에 복사되었습니다.');
      } else {
        alert('복사에 실패했습니다.');
      }
    }
  }, [formattedResult]);

  const handleDownload = useCallback(() => {
    if (formattedResult) {
      const blob = new Blob([formattedResult.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.title || 'post'}_${selectedPlatform}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [formattedResult, post.title, selectedPlatform]);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-900">포맷 변환</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            icon={<Eye className="w-4 h-4" />}
          >
            미리보기
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={formatPost}
          >
            변환
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 설정 및 옵션 */}
        <div className="w-full lg:w-1/3 p-4 border-r bg-gray-50">
          <div className="space-y-4">
            {/* 플랫폼 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                플랫폼 선택
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as 'tistory' | 'naver' | 'custom')}
                className="input-field"
              >
                <option value="tistory">티스토리</option>
                <option value="naver">네이버 블로그</option>
                <option value="custom">마크다운</option>
              </select>
            </div>

            {/* 플랫폼별 설정 */}
            {selectedPlatform === 'tistory' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  티스토리 설정
                </h3>
                <Input
                  label="Access Token"
                  value={config.tistory.accessToken}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    tistory: { ...prev.tistory, accessToken: e.target.value }
                  }))}
                  placeholder="티스토리 Access Token을 입력하세요"
                  type="password"
                />
                <Input
                  label="블로그명"
                  value={config.tistory.blogName}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    tistory: { ...prev.tistory, blogName: e.target.value }
                  }))}
                  placeholder="블로그명을 입력하세요"
                />
                <Input
                  label="카테고리 ID (선택)"
                  value={config.tistory.categoryId || ''}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    tistory: { ...prev.tistory, categoryId: e.target.value }
                  }))}
                  placeholder="카테고리 ID를 입력하세요"
                />
              </div>
            )}

            {selectedPlatform === 'naver' && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  네이버 블로그 설정
                </h3>
                <Input
                  label="Client ID"
                  value={config.naver.clientId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    naver: { ...prev.naver, clientId: e.target.value }
                  }))}
                  placeholder="네이버 Client ID를 입력하세요"
                />
                <Input
                  label="Client Secret"
                  value={config.naver.clientSecret}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    naver: { ...prev.naver, clientSecret: e.target.value }
                  }))}
                  placeholder="네이버 Client Secret을 입력하세요"
                  type="password"
                />
                <Input
                  label="블로그 ID"
                  value={config.naver.blogId}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    naver: { ...prev.naver, blogId: e.target.value }
                  }))}
                  placeholder="블로그 ID를 입력하세요"
                />
              </div>
            )}

            {/* 포스트 정보 미리보기 */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">포스트 정보</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>제목:</strong> {post.title || '제목 없음'}</p>
                <p><strong>카테고리:</strong> {post.category || '없음'}</p>
                <p><strong>태그:</strong> {post.tags.join(', ') || '없음'}</p>
                <p><strong>상태:</strong> {post.status === 'published' ? '발행' : '임시저장'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 변환 결과 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">변환 결과</h2>
            {formattedResult && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  icon={<Copy className="w-4 h-4" />}
                >
                  복사
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  icon={<Download className="w-4 h-4" />}
                >
                  다운로드
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {formattedResult ? (
              <div className="space-y-4">
                {formattedResult.success ? (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        ✅ {selectedPlatform === 'tistory' ? '티스토리' : 
                           selectedPlatform === 'naver' ? '네이버 블로그' : '마크다운'} 형식으로 변환되었습니다.
                      </p>
                    </div>
                    <Textarea
                      value={formattedResult.content}
                      readOnly
                      className="font-mono text-sm"
                      rows={20}
                    />
                  </>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ❌ 변환에 실패했습니다: {formattedResult.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>변환 버튼을 클릭하여 포맷을 변환하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};