export interface Conversation {
	_id: string;
	name: string;
	status: string;
	creName: {
		profilePicture: string;
		nameAsPerNID: string;
	};
	messagesSeen: boolean;
	createdAt: string;
	lastMessage: string;
	lastMessageTime: string;
	lastCustomerMessageTime: string;
	sentByMe: boolean;
	pageInfo: {
		pageName: string;
		pageProfilePicture: string;
	};
}

// Interface for an individual CRE (Customer Relationship Executive)
export interface CRE {
  _id: string;
  name: string;
  nickname: string;
  profilePicture: string;
}

// Interface for a Page
export interface Page {
  pageId: string;
  pageName: string;
  pageProfilePicture: string;
}

// Main interface for the available filters
export interface AvailableFilters {
  creNames: CRE[];         // Array of CRE objects
  pages: Page[];           // Array of Page objects
  statuses: string[];      // Array of status strings
}

export interface GetAllConversationsResponse {
	totalLeads: number;
	totalPages: number;
	currentPage: number;
	leads: Conversation[];
	filters: AvailableFilters;
}
