import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface Artifact {
  name: string;
  typeId: number;
  category: string;
}

const Checkbox = ({
  artifact,
  onChange,
  isChecked,
}: {
  artifact: Artifact;
  onChange: (artifact: Artifact, checked: boolean) => void;
  isChecked: boolean;
}) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const cookies = new Cookies();
  const router = useRouter();

  const { id } = router.query;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    setChecked(newCheckedState);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/projects/${id}/necessary`,
        {
          artifactTypeId: artifact.typeId,
          necessary: newCheckedState,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${cookies.get("accessToken")}`,
          },
        }
      );

      if (response) {
        onChange(artifact, newCheckedState);
      } else {
        console.error("Failed to update artifact status");
        setChecked(!newCheckedState); // Revert if the request fails
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setChecked(!newCheckedState); // Revert if the request fails
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
