import type { ParsedBody } from '@github/issue-parser'
import type { ProjectColumnNames, RoomAmenity, RoomType } from './enums.js'

/** Action Inputs */
export type ActionInputs = {
  action: string
  issueBody: ParsedBody
  issueTemplatePath: string
  projectNumber: number
  workspace: string
}

/** Reservation Request Details */
export type ReservationRequest = {
  /** Check In Date */
  checkIn: Date
  /** Check Out Date */
  checkOut: Date
  /** Number of Guests */
  guests: number
  /** Room Type */
  room: string
  /** Room Amenities */
  amenities: {
    selected: RoomAmenity[]
    unselected: RoomAmenity[]
  }
}

/** Room Details */
export type Room = {
  number: number
  type: RoomType
  price: number
  max_guests: number
  amenities: RoomAmenity[]
}

/** GraphQL ProjectsV2 Query Response */
export type GraphQlProjectsV2QueryResponse = {
  repository: {
    issue: {
      projectItems: {
        nodes: {
          id: string
          fieldValueByName: {
            name: ProjectColumnNames
            optionId: string
          }
        }[]
      }
    }
    projectV2: {
      id: string
      field: {
        id: string
        name: string
        options: {
          id: string
          name: ProjectColumnNames
        }[]
      }
    }
  }
}
