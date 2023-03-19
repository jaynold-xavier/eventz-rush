import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

export default function InlineEditor({
  value,
  onChange,
  className,
  viewerTemplate: Viewer,
  editorTemplate: Editor,
  initEditMode = false,
  placeholder,
}) {
  const [updatedValue, setUpdatedValue] = useState();
  const [editMode, setEditMode] = useState(initEditMode);

  useEffect(() => {
    setUpdatedValue(value);
  }, [value]);

  const saveChanges = () => {
    console.log("saveChanges");
    onChange(updatedValue);
    setEditMode(false);
  };

  const cancelChanges = (e) => {
    console.log("cancelChanges");
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUpdatedValue(value);
    setEditMode(false);
  };

  const classNames = ["inline-editor"];
  if (className) {
    classNames.push(className);
  }

  if (editMode) {
    classNames.push("edit-mode");
  }

  if (!updatedValue && placeholder) {
    classNames.push("has-placeholder");
  }

  if (!(Viewer && Editor)) return null;

  return (
    <div
      className={classNames.join(" ")}
      onClick={(e) => {
        console.log("onclick");
        if (editMode) return;
        e.preventDefault();
        e.stopPropagation();
        setEditMode(true);
      }}
      onBlur={(e) => {
        console.log("onblur", e.target, e.currentTarget, e.relatedTarget);
        if (e.relatedTarget && e.relatedTarget.tagName !== "INPUT") return;
        e.preventDefault();
        e.stopPropagation();
        setUpdatedValue(value);
        setEditMode(false);
      }}
    >
      {editMode ? (
        <Editor
          className="w-100"
          value={updatedValue}
          placeholder={placeholder}
          onChange={setUpdatedValue}
        />
      ) : (
        <Viewer value={updatedValue} placeholder={placeholder} />
      )}

      {editMode ? (
        <EditorActions onSave={saveChanges} onCancel={cancelChanges} />
      ) : null}
    </div>
  );
}

function EditorActions({ onSave, onCancel }) {
  return (
    <Button.Group className="inline-editor-actions" size="small">
      <Button
        type="primary"
        icon={<CheckOutlined className="font-12" />}
        onClick={onSave}
      />

      <Button icon={<CloseOutlined className="font-12" />} onClick={onCancel} />
    </Button.Group>
  );
}
