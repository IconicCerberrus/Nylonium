import { createContext, useContext } from 'react'

/**
 * Lets any component ask for the contact dialog without threading state
 * through the tree. `openContact()` takes an optional channel id to expand on
 * open, and an optional `channels` list to narrow what is offered.
 */
export const ContactDialogContext = createContext({
  openContact: () => {},
})

export function useContactDialog() {
  return useContext(ContactDialogContext)
}
