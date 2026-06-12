import { useState } from "react";
import { clearAiApiKey, getAiApiKey, maskAiApiKey, saveAiApiKey } from "../services/storage";

interface SettingsPageProps {
  onClearData: () => void;
}

export function SettingsPage({ onClearData }: SettingsPageProps) {
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const [savedApiKey, setSavedApiKey] = useState(() => getAiApiKey());
  const aiMode = savedApiKey ? "Real AI 模式" : "Mock 模式";

  function handleClearData() {
    if (window.confirm("确认清空本地训练数据？此操作不能撤销。")) {
      onClearData();
    }
  }

  function handleSaveApiKey() {
    saveAiApiKey(apiKeyDraft);
    setSavedApiKey(getAiApiKey());
    setApiKeyDraft("");
  }

  function handleClearApiKey() {
    clearAiApiKey();
    setSavedApiKey("");
    setApiKeyDraft("");
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>设置</h1>
        <p>本地训练数据只保存在当前浏览器。</p>
      </header>

      <section className="plain-section">
        <h2>App 简介</h2>
        <p>
          表达训练用于每日完成一次表达闭环：阅读片段、拆解技巧、进入场景、作答、诊断、重写、优化并保存最佳表达。
        </p>
      </section>

      <section className="plain-section">
        <h2>版本</h2>
        <p>V0.2</p>
      </section>

      <section className="plain-section">
        <h2>AI 配置</h2>
        <p>未配置 API Key 时使用本地 mock AI。配置后，训练诊断和重写优化会优先调用 OpenAI-compatible 接口。</p>
        <p className="notice-text">当前 API Key 保存在本机浏览器，仅适合本地使用；公开上线前应改为后端代理。</p>
        <div className="settings-grid">
          <div>
            <span className="setting-label">当前 AI 模式</span>
            <strong>{aiMode}</strong>
          </div>
          <div>
            <span className="setting-label">API Key 状态</span>
            <strong>{maskAiApiKey(savedApiKey)}</strong>
          </div>
        </div>
        <label className="field">
          <span>API Key</span>
          <input
            autoComplete="off"
            type="password"
            value={apiKeyDraft}
            onChange={(event) => setApiKeyDraft(event.target.value)}
            placeholder="输入 API Key 后保存"
          />
          <span className="field-meta">Key 只保存在当前浏览器 LocalStorage，不会写入代码。</span>
        </label>
        <div className="split-actions">
          <button className="secondary-button" type="button" onClick={handleSaveApiKey} disabled={!apiKeyDraft.trim()}>
            保存 API Key
          </button>
          <button className="secondary-button" type="button" onClick={handleClearApiKey} disabled={!savedApiKey}>
            清除 API Key
          </button>
        </div>
      </section>

      <button className="danger-button" type="button" onClick={handleClearData}>
        清空本地训练数据
      </button>
    </section>
  );
}
