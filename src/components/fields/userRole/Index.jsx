import React from "react";
import { Radio, Dropdown } from "antd";
import { find, get, map } from "lodash";

import { userRolesOptions, vendorTypesOptions } from "../../../constants/dropdown";
import { VENDOR_TYPES } from "../../../constants/app";

export default function UserRoleSelect({ value, onChange, ...rest }) {
  const setVendorType = ({ key }) => {
    const vendorType = find(vendorTypesOptions, (opt) => opt.key === key);
    if (vendorType) {
      onChange(vendorType.value);
    }
  };

  const isHostSelected = !value || value === userRolesOptions[0].value;
  let vendorSelectText;
  if (!isHostSelected) {
    vendorSelectText =
      value === userRolesOptions[1].value
        ? "Select Vendor"
        : get(VENDOR_TYPES[value], "text");
  }

  return (
    <Radio.Group
      className="type-field w-100"
      buttonStyle="solid"
      value={transformValue(value)}
      onChange={onChange}
      {...rest}
    >
      {map(userRolesOptions, (option) => {
        return (
          <Radio.Button
            key={option.value}
            className="text-center"
            value={option.value}
            style={{ width: "50%" }}
          >
            {option.value === userRolesOptions[0].value ? (
              option.label
            ) : (
              <Dropdown
                menu={{
                  items: vendorTypesOptions,
                  selectable: true,
                  selectedKeys: [value],
                  onClick: setVendorType,
                }}
                open={isHostSelected ? false : undefined}
              >
                {isHostSelected ? (
                  <span>{option.label}</span>
                ) : (
                  <div>{`${vendorSelectText} ▼`}</div>
                )}
              </Dropdown>
            )}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );

  function transformValue(value) {
    if (!value) return;

    return value === userRolesOptions[0].value
      ? userRolesOptions[0].value
      : userRolesOptions[1].value;
  }
}
