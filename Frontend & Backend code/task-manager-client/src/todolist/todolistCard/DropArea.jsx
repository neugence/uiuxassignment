
import { Plus } from "lucide-react";
import { useState } from "react";

const DropArea = ({onDrop}) => {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div className="">
        <div
      onDragEnter={() => setShowDrop(true)}
      onDragLeave={() => setShowDrop(false)}
      onDrop={()=>{
        onDrop()
        setShowDrop(false)
      }}
      onDragOver={e => e.preventDefault()}
      className={showDrop ? "drop_area p-" : "hide_drop"}
    >
      <Plus className={`text-black font-semibold`} />
    </div>
    </div>
  );
};

export default DropArea;

