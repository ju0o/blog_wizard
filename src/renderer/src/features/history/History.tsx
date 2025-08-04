import React, { useState, useCallback } from 'react';
import { Button } from '../../components/ui/Button';
import { HistoryItem } from '../../types';
import { Clock, FileText, Trash2, RotateCcw, Eye } from 'lucide-react';
import { formatFileSize } from '../../utils';

interface HistoryProps {
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDelete: (itemId: string) => void;
  onView: (content: string) => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onRestore,
  onDelete,
  onView,
}) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const handleRestore = useCallback((item: HistoryItem) => {
    onRestore(item);
  }, [onRestore]);

  const handleDelete = useCallback((itemId: string) => {
    if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      onDelete(itemId);
    }
  }, [onDelete]);

  const handleView = useCallback((item: HistoryItem) => {
    onView(item.content);
    setSelectedItem(item);
  }, [onView]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-900">히스토리</h1>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'draft' | 'published')}
            className="input-field w-auto"
          >
            <option value="all">전체</option>
            <option value="draft">임시저장</option>
            <option value="published">발행글</option>
          </select>
        </div>
      </div>

      {/* 히스토리 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>히스토리가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`card cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedItem?.id === item.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title || '제목 없음'}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status === 'published' ? '발행' : '임시저장'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {formatDate(item.timestamp)}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item);
                      }}
                      icon={<Eye className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(item);
                      }}
                      icon={<RotateCcw className="w-4 h-4" />}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      icon={<Trash2 className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 선택된 항목 상세 정보 */}
      {selectedItem && (
        <div className="border-t bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">상세 정보</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedItem(null)}
            >
              닫기
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>제목:</strong> {selectedItem.title || '제목 없음'}</p>
            <p><strong>상태:</strong> {selectedItem.status === 'published' ? '발행' : '임시저장'}</p>
            <p><strong>저장 시간:</strong> {formatDate(selectedItem.timestamp)}</p>
            <p><strong>크기:</strong> {formatFileSize(selectedItem.content.length)}</p>
          </div>
        </div>
      )}
    </div>
  );
};