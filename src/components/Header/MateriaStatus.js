import {
  Badge,
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import {
  QuestionIcon
} from "@chakra-ui/icons";
import React from "react";
import { GraphContext, UserContext } from "../../Contexts";

const MateriaStatus = () => {
  const { isMobile } = React.useContext(UserContext);
  const { getNode, displayedNode } = React.useContext(GraphContext);

  const node = React.useMemo(() => getNode(displayedNode), [displayedNode, getNode])

  return displayedNode && (
    <Flex height="fit-content" flexWrap="wrap" gap={2}>
      {isMobile ? (
        <Text textAlign="center" noOfLines={1} width="100vw" px={8} color="white"><strong>[{node?.id}]</strong> {node?.materia}</Text>
      ) : (
          <Stat color="white" minWidth="16ch" maxWidth="30ch" mr="1">
            <StatLabel>[{node?.id}]</StatLabel>
          <StatHelpText noOfLines={1}>
            {node?.materia}
          </StatHelpText>
        </Stat>
      )}

      <Flex direction={isMobile ? "row" : "column"} m="auto" gap={2} textAlign="center" alignSelf="center">
        <Badge
          width="100%"
          px={2}
          colorScheme="green"
          variant="outline"
        >
          {node?.id === "CBC" ? `Clickealo para ver las materias!` : `Otorga ${node?.creditos} créditos`}
        </Badge>

        {node?.group === "Habilitada Parcial" &&
          <Tooltip placement="bottom" label="">
            <Badge
              width="100%"
              px={2}
              colorScheme="orange"
              variant="outline"
            >
              Puede ser cursada pero no acreditada
            </Badge>
          </Tooltip>
        }
      </Flex>
    </Flex>
  )
};

export default MateriaStatus;
