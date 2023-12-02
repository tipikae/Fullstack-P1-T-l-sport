import { Participation } from "./Participation";

/**
 * Olympic model.
 */
export interface Olympic {

    id: number;
    country: string;
    participations: Participation[];
}