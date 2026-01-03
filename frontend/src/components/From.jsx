import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

const Form = () => {
  const { user } = useAuth();

  const containerWrap = useRef(null);
  const t1 = useRef(null);
  const hasPlayed = useRef(false);

  useGSAP(
    () => {
      t1.current = gsap.timeline({ paused: true });

      t1.current.to(".form-cover", {
        y: "-90%",
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        pointerEvents: "none",
      });
    },
    { scope: containerWrap }
  );

  const handleMouseEnter = () => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    t1.current.play();
  };

  return (
    <div
      ref={containerWrap}
      onMouseEnter={handleMouseEnter}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-white/40 p-6 relative"
    >
      <div className="flex items-center justify-center gap-4 my-4">
        <img
          src={user?.photoURL}
          alt="User"
          className="rounded-full object-cover h-10 w-10"
          draggable="false"
        />
        <h3 className="font-bold">{user?.displayName}</h3>
      </div>

      <form className="flex flex-col mx-4">
        <input
          type="text"
          placeholder="Brief Problem Title"
          className="w-full rounded-xl bg-white/80 px-4 py-3 my-3
                     shadow-inner border border-stone-200
                     focus:ring-2 focus:ring-stone-300 outline-none"
        />

        <textarea
          rows={8}
          placeholder="What's the issue?"
          className="w-full rounded-xl bg-white/80 px-4 py-3 my-3
                     shadow-inner border border-stone-200
                     focus:ring-2 focus:ring-stone-300 outline-none resize-none"
        />

        <div className="my-4 flex flex-wrap gap-3 justify-between items-center">
          <button className="bg-gray-200 p-3 rounded font-semibold w-1/2 hover:scale-95 transition">
            Upload photos
          </button>

          <select className="bg-gray-200 p-3 rounded font-semibold w-1/4">
            <option value="">Select an option</option>
            <option>Construction</option>
            <option>Sanitary</option>
            <option>Traffic</option>
            <option>Pollution</option>
            <option>Corruption</option>
          </select>

          <button className="bg-green-400 p-4 rounded">Location</button>
          <button className="bg-red-500 p-4 text-white rounded">Submit</button>
        </div>
      </form>


      <div
        className="form-cover absolute inset-0 rounded-2xl z-10
             bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url(/eyesBg.gif)" }}
      />

    </div>
  );
};

export default Form;
