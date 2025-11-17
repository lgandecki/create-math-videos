/**
 * Custom Events Type Definitions
 *
 * This file defines the structure of custom events used throughout the application.
 * These events enable communication between different components and contexts.
 */

export interface CalculateSlideRuleEventDetail {
  pinkNumber: number;
}

export interface CalculateSlideRuleEvent extends CustomEvent<CalculateSlideRuleEventDetail> {
  type: "calculateSlideRule";
  detail: CalculateSlideRuleEventDetail;
}

export const dispatchCalculateSlideRule = (detail: CalculateSlideRuleEventDetail) => {
  const event = new CustomEvent("calculateSlideRule", { detail });
  window.dispatchEvent(event);
};
