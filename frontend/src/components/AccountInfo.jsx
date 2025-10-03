import { Typography } from "antd";

const { Text } = Typography;
export default function AccountInfo({ address, balance }) {
  return (
    <div className="my-[16px]">
      <p>
        账户：
        <Text copyable={address}>{address || "--"}</Text>
      </p>
      <p>余额：{balance}</p>
    </div>
  );
}
