import Image from "next/image";
import { useState } from "react";

import { Button } from "./ui/button";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
  type="submit"
  disabled={isLoading}
  className={className ?? "shad-primary-btn w-full"}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  style={{
    backgroundColor: isHovered ? "blue" : "#001d80ba;", // Change colors as needed
    color: isHovered ? "white" : "black", // Text color on hover
    transition: "background-color 0.3s, color 0.3s", // Smooth transition effect
    cursor: "pointer",
  }}
>
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;