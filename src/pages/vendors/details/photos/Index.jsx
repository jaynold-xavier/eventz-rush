import { Image } from "antd";
import React from "react";

const cols = [100, 200, 300];

export default function Photos() {
  return (
    <div className="gallery">
      {new Array(40).fill(null).map((val, i) => {
        return (
          <div key={i} className="pb-3">
            <Image
              src={`https://picsum.photos/1200/${
                1200 - cols[i % 3]
              }?random=${i}`}
              width="100%"
              alt="test"
            />
          </div>
        );
      })}
    </div>
  );
}
