import React from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

export default function RichTextEditor({ ...rest }) {
  return <ReactQuill autoFocus {...rest} />;
}
