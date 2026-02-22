"use client";

import { Button, Menu, MenuItem } from "@/components/ui";
import { Corner } from "@/components/layout";
import type { Language } from "@/lib/i18n";
import type { ToolType } from "@/types";
import Link from "next/link";

interface HomeInfoMenusProps {
  t: (key: string) => string;
}

interface HomeToolsProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  t: (key: string) => string;
}

interface HomeSettingsProps {
  t: (key: string) => string;
  language: Language;
  availableLanguages: Language[];
  onLanguageChange: (language: Language) => void;
  color: string;
  onColorChange: (color: string) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onExportSvg: () => void;
  onClearCanvas: () => void;
  showNewButton: boolean;
}

interface HomeEncryptProps {
  t: (key: string) => string;
  canvasFilled: boolean;
  password: string;
  isSaving: boolean;
  savedUrl: string | null;
  onPasswordChange: (value: string) => void;
  onSave: () => void;
  onCopyUrl: () => void;
}

function ToolFunctionalityList({ t }: { t: (key: string) => string }) {
  return (
    <div className="space-y-1 text-xs">
      <p className="font-medium">{t("tools.toolFunctionality")}:</p>
      <p>
        {t("tools.pen.title")}
        <span className="ml-1">D</span>
      </p>
      <p>
        {t("tools.text.title")}
        <span className="ml-1">W</span>
      </p>
      <p>
        {t("tools.move.title")}
        <span className="ml-1">M</span>
      </p>
      <p>
        {t("tools.pen.title")}
        <span className="ml-1">
          {t("general.click")}, {t("general.drag")}
        </span>
      </p>
      <p>
        {t("tools.pen.deleteLast")}
        <span className="ml-1">{t("general.delete")}</span>
      </p>
      <p>
        {t("tools.pen.close")}
        <span className="ml-1">C</span>
      </p>
      <p>
        {t("tools.pen.startNew")}
        <span className="ml-1">D</span>
      </p>
      <p>
        {t("tools.text.moveCursor")}
        <span className="ml-1">
          {t("general.drag")}, {t("general.arrowKeys")}
        </span>
      </p>
      <p>
        {t("tools.text.deleteLast")}
        <span className="ml-1">{t("general.delete")}</span>
      </p>
      <p>
        {t("tools.move.movePath")}
        <span className="ml-1">{t("general.drag")}</span>
      </p>
      <p>
        {t("tools.move.movePoint")}
        <span className="ml-1">A + {t("general.drag")}</span>
      </p>
    </div>
  );
}

export function HomeInfoMenus({ t }: HomeInfoMenusProps) {
  return (
    <Corner position="tl">
      <Menu trigger={<Button>{t("general.more")}</Button>} position="tl">
        <MenuItem>
          <h1 className="text-lg font-medium">Crytch</h1>
          <p>{t("description")}</p>
        </MenuItem>
        <MenuItem>
          <ToolFunctionalityList t={t} />
        </MenuItem>
        <MenuItem>
          <div className="text-xs">
            <span>{t("settings.title")}: </span>
            <span>{t("settings.language")} EN DE NL </span>
            <span>{t("settings.color")} B W R B </span>
            <span>{t("settings.background")} B W R B </span>
            <span>{t("settings.strokeWidth")}</span>
          </div>
        </MenuItem>
        <MenuItem>
          <a href="/about" className="hover:underline">
            {t("general.more")} L&amp;M 2016+17
          </a>
        </MenuItem>
        <MenuItem noBorder>
          <a
            href={`mailto:hello@crytch.com?subject=${encodeURIComponent(t("general.emailDefaultSubject"))}`}
            className="hover:underline"
          >
            {t("general.emailLink")}
          </a>
        </MenuItem>
      </Menu>

      <Menu trigger={<Button>?</Button>} position="tl">
        <MenuItem>
          <h3 className="text-sm font-medium">{t("help.title")}</h3>
        </MenuItem>
        <MenuItem>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `1 ${t("help.1")}` }} />
        </MenuItem>
        <MenuItem>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `2 ${t("help.2")}` }} />
        </MenuItem>
        <MenuItem>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `3 ${t("help.3")}` }} />
        </MenuItem>
        <MenuItem>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `4 ${t("help.4")}` }} />
        </MenuItem>
        <MenuItem>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `:) ${t("help.5")}` }} />
        </MenuItem>
        <MenuItem noBorder>
          <p className="text-xs" dangerouslySetInnerHTML={{ __html: `6 ${t("help.6")}` }} />
        </MenuItem>
      </Menu>
    </Corner>
  );
}

export function HomeTools({ activeTool, onToolChange, t }: HomeToolsProps) {
  return (
    <Corner position="tr" className="max-sm:hidden">
      <Button variant={activeTool === "pen" ? "active" : "default"} onClick={() => onToolChange("pen")} title="D">
        {t("tools.pen.title")}
      </Button>
      <Button variant={activeTool === "text" ? "active" : "default"} onClick={() => onToolChange("text")} title="W" className="ml-2">
        {t("tools.text.title")}
      </Button>
      <Button variant={activeTool === "move" ? "active" : "default"} onClick={() => onToolChange("move")} title="M" className="ml-2">
        {t("tools.move.title")}
      </Button>
    </Corner>
  );
}

function ColorChoice({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant={isActive ? "active" : "grey"} onClick={onClick} className="px-2">
      {label}
    </Button>
  );
}

export function HomeSettings({
  t,
  language,
  availableLanguages,
  onLanguageChange,
  color,
  onColorChange,
  background,
  onBackgroundChange,
  strokeWidth,
  onStrokeWidthChange,
  onExportSvg,
  onClearCanvas,
  showNewButton,
}: HomeSettingsProps) {
  return (
    <Corner position="bl">
      <Menu trigger={<Button>{t("settings.title")}</Button>} position="bl">
        <MenuItem>
          <div className="flex items-center justify-between gap-4">
            <span>{t("settings.language")}</span>
            <div className="flex gap-1">
              {availableLanguages.map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? "active" : "grey"}
                  onClick={() => onLanguageChange(lang)}
                  className="px-2"
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="flex items-center justify-between gap-4">
            <span>{t("settings.color")}</span>
            <div className="flex gap-1">
              <ColorChoice isActive={color === "#000000"} label={t("settings.colorBlack")} onClick={() => onColorChange("#000000")} />
              <ColorChoice isActive={color === "#ffffff"} label={t("settings.colorWhite")} onClick={() => onColorChange("#ffffff")} />
              <ColorChoice isActive={color === "#ff0000"} label={t("settings.colorRed")} onClick={() => onColorChange("#ff0000")} />
              <ColorChoice isActive={color === "#0000ff"} label={t("settings.colorBlue")} onClick={() => onColorChange("#0000ff")} />
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="flex items-center justify-between gap-4">
            <span>{t("settings.background")}</span>
            <div className="flex gap-1">
              <ColorChoice isActive={background === "#000000"} label={t("settings.colorBlack")} onClick={() => onBackgroundChange("#000000")} />
              <ColorChoice isActive={background === "#ffffff"} label={t("settings.colorWhite")} onClick={() => onBackgroundChange("#ffffff")} />
              <ColorChoice isActive={background === "#ff0000"} label={t("settings.colorRed")} onClick={() => onBackgroundChange("#ff0000")} />
              <ColorChoice isActive={background === "#0000ff"} label={t("settings.colorBlue")} onClick={() => onBackgroundChange("#0000ff")} />
            </div>
          </div>
        </MenuItem>
        <MenuItem>
          <div className="flex items-center justify-between gap-4">
            <span>{t("settings.strokeWidth")}</span>
            <div className="flex items-center gap-1">
              <Button onClick={() => onStrokeWidthChange(strokeWidth - 1)} className="px-2">
                -
              </Button>
              <span className="w-8 text-center">{strokeWidth}</span>
              <Button onClick={() => onStrokeWidthChange(strokeWidth + 1)} className="px-2">
                +
              </Button>
            </div>
          </div>
        </MenuItem>
        <MenuItem className="py-1">
          <button type="button" onClick={onClearCanvas} className="text-left hover:underline">
            {t("general.clearCanvas")}
          </button>
        </MenuItem>
        <MenuItem noBorder className="py-1">
          <button type="button" onClick={onExportSvg} className="text-left hover:underline">
            {t("tools.export.exportSvg")}
          </button>
        </MenuItem>
      </Menu>

      {showNewButton && (
        <Button variant="grey" onClick={onClearCanvas} className="ml-2">
          {t("general.new")}
        </Button>
      )}
    </Corner>
  );
}

export function HomeEncrypt({
  t,
  canvasFilled,
  password,
  isSaving,
  savedUrl,
  onPasswordChange,
  onSave,
  onCopyUrl,
}: HomeEncryptProps) {
  return (
    <Corner position="br">
      {!savedUrl ? (
        <Menu
          trigger={
            <Button variant={canvasFilled ? "default" : "inactive"} disabled={!canvasFilled}>
              {t("tools.encrypt.title")}
            </Button>
          }
          position="br"
        >
          <MenuItem>
            <div className="mb-2">
              <label className="mb-1 block text-xs">
                {t("tools.encrypt.enterPassword")}: A-Z a-z 0-9
              </label>
              <input
                type="text"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                className="w-full"
                placeholder={t("general.password")}
                autoComplete="off"
              />
            </div>
          </MenuItem>
          <MenuItem noBorder>
            <Button
              onClick={onSave}
              disabled={!canvasFilled || isSaving}
              variant={canvasFilled && !isSaving ? "default" : "inactive"}
              className="w-full text-center"
            >
              {isSaving ? "..." : t("tools.encrypt.saveEncrypted")}
            </Button>
          </MenuItem>
        </Menu>
      ) : (
        <Menu trigger={<Button variant="active">{t("tools.send.title")}</Button>} position="br">
          <MenuItem>
            <a
              href={`mailto:?Subject=${encodeURIComponent(t("general.emailDefaultSubject"))}&body=${encodeURIComponent(savedUrl)}`}
              className="block text-xs hover:underline"
            >
              {t("tools.send.sendViaMail")}
            </a>
          </MenuItem>
          <MenuItem>
            <p className="mb-2 text-xs">{t("tools.send.findMessageAt")}</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={savedUrl}
                readOnly
                className="flex-1 text-xs"
                onClick={(event) => (event.target as HTMLInputElement).select()}
              />
              <Button onClick={onCopyUrl} className="px-2">
                Copy
              </Button>
            </div>
          </MenuItem>
          <MenuItem noBorder>
            <Link href="/" className="block text-xs hover:underline">
              {t("general.startNew")}
            </Link>
          </MenuItem>
        </Menu>
      )}
    </Corner>
  );
}
