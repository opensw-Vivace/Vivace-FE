import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "universal-cookie";

interface Artifact {
  name: string;
  typeId: number;
  category: string;
}

const Checkbox = ({
  artifact,
  onChange,
}: {
  artifact: Artifact;
  onChange: (artifact: Artifact, checked: boolean) => void;
}) => {
  const [checked, setChecked] = useState(false);

  const cookies = new Cookies();
  const router = useRouter();

  const { id } = router.query;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/necessary`,
      {
        artifactTypeId: artifact.typeId,
        necessary: isChecked,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${cookies.get("accessToken")}`,
        },
      }
    );

    if (response.ok) {
      onChange(artifact, isChecked);
    } else {
      // Error handling
      console.error("Failed to update artifact status");
      setChecked(!isChecked); // Revert if the request fails
    }
  };

  return (
    <div className="flex gap-[5px] py-[5px]">
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <div>{artifact.name}</div>
    </div>
  );
};

export default Checkbox;
