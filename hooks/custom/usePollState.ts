import { useEffect, useState } from "react";

export function usePollState({ initialPollItems = [] }) {
  const initialPollItemsSet = new Set(initialPollItems);

  const [selectedPollItems, setSelectedPollItems] = useState<Set<string>>(new Set());

  // calculate the difference btw poll and initialPoll
  const isModifiedPoll =
    selectedPollItems.size !== initialPollItemsSet.size ||
    Array.from(selectedPollItems.keys()).some((id) => !initialPollItemsSet.has(id)) ||
    Array.from(initialPollItemsSet.keys()).some((id) => !selectedPollItems.has(id));

  const [showRePollButton, setShowRePollButton] = useState(false);
  const [isActiveRePollButton, setIsActiveRePollButton] = useState(false);

  useEffect(() => {
    if (initialPollItems) {
      setSelectedPollItems(new Set(initialPollItems));
      if (initialPollItems.length !== 0) {
        setShowRePollButton(true);
        setIsActiveRePollButton(true);
      } else {
        setIsActiveRePollButton(false);
      }
    }
  }, [initialPollItems]);

  const handlePoll = ({ canMultiple, pollItem }: { canMultiple: boolean; pollItem: string }) => {
    const isChecked = selectedPollItems.has(pollItem);
    if (canMultiple) {
      setSelectedPollItems((prev) => {
        const cloned = new Set(prev);
        if (isChecked) cloned.delete(pollItem);
        else cloned.add(pollItem);
        return cloned;
      });
    } else {
      setSelectedPollItems((prev) => {
        const cloned = new Set(prev);
        if (isChecked) {
          cloned.delete(pollItem);
        } else if (cloned.size !== 0) {
          // if already checking other poll item
          cloned.clear();
          cloned.add(pollItem);
        } else {
          cloned.add(pollItem);
        }
        return cloned;
      });
    }
  };

  const isSelected = (pollItem: string) => {
    return selectedPollItems.has(pollItem);
  };

  const hideRePollButton = () => {
    setShowRePollButton(false);
  };

  const cancelPoll = () => {
    setShowRePollButton(true);
    setSelectedPollItems(initialPollItemsSet);
  };

  return {
    isModified: isModifiedPoll,
    selectedPollItems: Array.from(selectedPollItems.keys()),
    showRePollButton,
    isActiveRePollButton,
    handlePoll,
    isSelected,
    hideRePollButton,
    cancelPoll,
  };
}
