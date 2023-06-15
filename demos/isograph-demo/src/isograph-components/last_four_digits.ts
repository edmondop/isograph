import { iso } from "@isograph/react";
import type { ResolverParameterType } from "./__isograph/BillingDetails__last_four_digits.isograph";

export const last_four_digits = iso<
  ResolverParameterType,
  ReturnType<typeof LastFour>
>`
  BillingDetails.last_four_digits @eager {
    credit_card_number,
  }
`(LastFour);

function LastFour(data: ResolverParameterType) {
  return data.credit_card_number.substring(data.credit_card_number.length - 4);
}