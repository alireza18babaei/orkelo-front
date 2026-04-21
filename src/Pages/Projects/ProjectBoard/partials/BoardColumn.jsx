import React, { useRef, useState } from 'react';
import ActionDropdown from '../../../../Components/ActionDropdown';

const BoardColumn = ({
  columnTitle,
  columnIcon,
  taskCount,
  innerRef,
  headerRef,
  dragHandleProps,
  color,
  className = '',
  style,
  children,
  actions = [],
  contentRef,
  contentInnerRef,
  contentClassName = '',
  contentProps,
  footer,
  ...rest
}) => {
  const [columnAction, setColumnAction] = useState(false);
  const rootRef = useRef();
  const hasActions = actions.length > 0;

  const normalizeIconClass = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return '';
    if (s.includes('ph-') || s.includes('fa-') || s.includes('ti ')) return s;
    if (s.startsWith('ti-')) return `ti ${s}`;
    if (/^[a-z0-9-]+$/i.test(s)) return `ti ti-${s}`;
    return s;
  };

  const iconClass = normalizeIconClass(columnIcon);
  const normalizeTaskCount = (raw) => {
    if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return raw;
    if (typeof raw === 'string' && raw.trim()) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0) return parsed;
    }
    return null;
  };
  const normalizedTaskCount = normalizeTaskCount(taskCount);
  const setContentNodeRef = (node) => {
    if (typeof contentInnerRef === 'function') {
      contentInnerRef(node);
    } else if (contentInnerRef && typeof contentInnerRef === 'object') {
      contentInnerRef.current = node;
    }

    if (typeof contentRef === 'function') {
      contentRef(node);
    } else if (contentRef && typeof contentRef === 'object') {
      contentRef.current = node;
    }
  };

  return (
    <div
      ref={innerRef}
      className={`board-column box-shadow-4 ${className}`}
      style={style}
      {...rest}
    >
      <div
        ref={headerRef}
        className='board-column-header f-w-600 text-white d-flex justify-content-between align-items-center border-t-0'
        style={{
          backgroundColor: `${color}`,
        }}
      >
        <div className='board-column-header__main d-flex align-items-center justify-content-between flex-grow-1'>
          <div className='board-column-header__title'>
            {iconClass ? (
              <span className='fs-2' aria-hidden='true'>
                <i className={iconClass} />
              </span>
            ) : null}
            <span className='board-column-header__label'>{columnTitle}</span>
          </div>
          {normalizedTaskCount != null ? (
            <span
              className='board-column-task-count'
              aria-label={`${normalizedTaskCount} tasks`}
            >
              {normalizedTaskCount}
            </span>
          ) : null}
        </div>
        <div
          className='board-column-drag-handle'
          {...(dragHandleProps || {})}
        />
        {hasActions ? (
          <div ref={rootRef} className='position-relative'>
            <button
              type='button'
              className='text-light btn icon-btn fs-4'
              onClick={(e) => {
                e.stopPropagation();
                setColumnAction((v) => !v);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label='Column actions'
            >
              <i className='ph-light ph-gear'></i>
            </button>
            <ActionDropdown
              onToggle={setColumnAction}
              open={columnAction}
              rootRef={rootRef}
              actions={actions}
            />
          </div>
        ) : null}
      </div>
      <div className='board-column-content-wrapper'>
        <div
          ref={setContentNodeRef}
          className={`board-column-content ${contentClassName}`}
          {...(contentProps || {})}
        >
          {children}
        </div>
        {footer ? <div className='board-column-footer'>{footer}</div> : null}
      </div>
    </div>
  );
};

export default BoardColumn;
