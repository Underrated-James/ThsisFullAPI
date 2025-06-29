import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActionType } from "../types/ActionType";
import { resetAction } from "../Actions/index"; // ✅ fixed import

import { useVoiceCommandContext } from "../../../components/VoiceCommandContext";

const Game2048VoiceHandler = () => {
  const dispatch = useDispatch();
  const { registerHandler, unregisterHandler } = useVoiceCommandContext();

  useEffect(() => {
    const handler = (command: string) => {
      const cleaned = command.toLowerCase().trim();

      // Undo
      if (cleaned === "undo") {
        dispatch({ type: ActionType.UNDO });
        return true;
      }

      // Map of voice inputs to board sizes
      const sizeMap: Record<string, number> = {
  // 3x3 Variants
  "3x3": 3,
  "3 x 3": 3,
  "3 by 3": 3,
  "three by three": 3,
  "times 3": 3,
  "* 3": 3,
  "three": 3,
  "3": 3,

  // 4x4 Variants
  "4x4": 4,
  "4 x 4": 4,
  "4 by 4": 4,
  "four by four": 4,
  "times 4": 4,
  "* 4": 4,
  "four": 4,
  "4": 4,

  // 5x5 Variants
  "5x5": 5,
  "5 x 5": 5,
  "5 by 5": 5,
  "five by five": 5,
  "times 5": 5,
  "* 5": 5,
  "five": 5,
  "5": 5,

  // 6x6 Variants
  "6x6": 6,
  "6 x 6": 6,
  "6 by 6": 6,
  "six by six": 6,
  "times 6": 6,
  "* 6": 6,
  "six": 6,
  "6": 6,
};


      const matchedSize = sizeMap[cleaned];
      if (matchedSize) {
        dispatch(resetAction(matchedSize)); // ✅ use correct action
        return true;
      }

      return false;
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [dispatch, registerHandler, unregisterHandler]);

  return null;
};

export default Game2048VoiceHandler;
