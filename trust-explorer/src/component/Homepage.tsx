import dynamic from "next/dynamic";

// --- Chakra-UI ---
import {
  Box,
  ComponentDefaultProps,
  ComponentWithAs,
  Flex,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import Image from "next/image";

// --- Components ---
const SearchHistoryComponent = dynamic(() => import("./SearchHistory"));
const ThemeButtonComponent = dynamic(() => import("./ThemeButton"));

// --- Component Props Interface ---
interface IMainContentProps {
  children: React.ReactNode;
}

export default function Homepage({ children }: IMainContentProps): JSX.Element {
  const { colorMode } = useColorMode();

  const buttonStyleProps:
    | ComponentDefaultProps
    | ComponentWithAs<"button", IconButtonProps> = {
    color: useColorModeValue("gray.50", "gray.600"),
    bgColor: useColorModeValue("gray.600", "gray.50"),
    borderRadius: "xl",
    boxShadow: "xl",
    _hover: { backgroundColor: useColorModeValue("gray.700", "gray.200") },
  };

  return (
    <Box overflow="hidden">
      <Flex
        _dark={{ display: "none" }}
        _light={{ display: "flex" }}
        gap={4}
        height=""
        position="absolute"
        top={[1, 5]}
        left={[4, 10]}
        zIndex="overlay"
      >
        <Image src={"/logo.png"} alt={"Logo"} width={220} height={0} />
      </Flex>
      <Flex
        _dark={{ display: "flex" }}
        _light={{ display: "none" }}
        gap={4}
        height=""
        position="absolute"
        top={[1, 5]}
        left={[4, 10]}
        zIndex="overlay"
      >
        <Image src={"/darkest-logo.png"} alt={"Logo"} width={220} height={0} />
      </Flex>
      <Flex
        gap={4}
        height=""
        position="absolute"
        top={[4, 10]}
        right={[4, 10]}
        zIndex="overlay"
      >
        <SearchHistoryComponent styleProps={buttonStyleProps} />

        <ThemeButtonComponent styleProps={buttonStyleProps} />
      </Flex>

      {children}
    </Box>
  );
}