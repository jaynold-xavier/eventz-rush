import { Image } from "antd";
import React from "react";
import { map } from "lodash";

export default function Photos({ data }) {
  return (
    <div className="gallery">
      {map(data, (url, i) => {
        return (
          <div key={i} className="pb-3">
            <Image src={url} width="100%" alt="test" />
          </div>
        );
      })}
    </div>
  );
}
