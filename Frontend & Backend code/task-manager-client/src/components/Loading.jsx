import { RotateLoader } from "react-spinners";

const Loading = () => {
  return (
    <RotateLoader
      className=""
      color="#9c0caa"
      loading={true}
      size={20}
    />
  );
};

export default Loading;