import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressBar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedPrgress, setAnimatedPrgress] = useState(0);
  

    useEffect(() => { 
        if (isMediaUploading) {
            setShowProgress(true)
            setAnimatedPrgress(progress)
        }else{
            const timer = setTimeout(() => {
                setShowProgress(false)
            }, 1000);

            return () => { clearTimeout(timer) }
        }
     },[isMediaUploading, progress])


  return (
    <div className="w-full bg-gray-200 relative rounded-full h-3 overflow-hidden mb-4">
      <motion.div
        className="bg-blue-500 h-full rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedPrgress}%`,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {progress >= 100 && isMediaUploading &&
          (
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 bg-green-500 opacity-50"
              animate={{
                x: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )
        }
      </motion.div>
    </div>
  );
}

export default MediaProgressBar;
