import { Component } from "react";
import ThreeEntryPoint from "./ThreeEntryPoint";

let flag: boolean = false;
export default class ThreeContainer extends Component {
  [x: string]: any;
  componentDidMount() {
    if (!flag) {
      flag = true;
      ThreeEntryPoint(this.scene);
    }
  }

  render() {
    return (
      <>
        <div ref={(element) => (this.scene = element)} />
      </>
    );
  }
}
