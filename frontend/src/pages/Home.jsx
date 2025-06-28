import React, { useContext } from "react";
import AuthModal from "../components/AuthModal";
import AuthContext from "../context/AuthContext";

import HomeGuestContent from "./HomeGuestContent";
import HomeAuthenticatedContent from "./HomeAuthenticatedContent";

const Home = () => {
  const { isLoggedIn, userData } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleAuthClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, delay: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, delay: 1, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <>
      {isLoggedIn && userData ? (
        <HomeAuthenticatedContent
          userData={userData}
          buttonVariants={buttonVariants}
        />
      ) : (
        <HomeGuestContent
          handleAuthClick={handleAuthClick}
          titleVariants={titleVariants}
          subtitleVariants={subtitleVariants}
          buttonVariants={buttonVariants}
        />
      )}

      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Home;
