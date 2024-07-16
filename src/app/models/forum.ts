import {Thread} from "./thread";

export interface Forum {
  id: number;
  name: string;
  description: string;
  threads: Thread[];
}
