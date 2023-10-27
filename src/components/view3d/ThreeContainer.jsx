import { Component } from "react";
import ThreeEntryPoint from "./ThreeEntryPoint";

let flag = false;
export default class ThreeContainer extends Component {
  componentDidMount() {
    if (!flag) {
      flag = true;
      ThreeEntryPoint(this.scene);
    }
  }

  render() {
    return <div ref={(element) => (this.scene = element)} />;
  }
}
