import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export function SearchBar(props) {
  // Pass the computed styles into the `__css` prop
  const { address, setAddress, variant, background, children, placeholder, borderRadius, ...rest } =
    props;
  const onSearchBoxChange = (event) => {
    const value = event.target.value;
    if (value === '') {
      const covalentHardAddress = '0xa79e63e78eec28741e711f89a672a4c40876ebf3';
      setAddress(covalentHardAddress);
      return;
    }
    setAddress(value);
    console.log(address);
  } 
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  return (
    <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
      <InputLeftElement
        children={
          <IconButton
            bg='inherit'
            borderRadius='inherit'
            _hover='none'
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
            icon={
              <SearchIcon color={searchIconColor} w='15px' h='15px' />
            }></IconButton>
        }
      />
      <Input
        variant='search'
        fontSize='sm'
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight='500'
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        borderRadius={borderRadius ? borderRadius : "30px"}
        placeholder={placeholder ? placeholder : "Enter Address"}
        value={address}
        onChange={(e)=>onSearchBoxChange(e)}
      />
    </InputGroup>
  );
}
