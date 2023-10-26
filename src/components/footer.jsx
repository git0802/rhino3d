import vhtml from 'vhtml';

import { REVISION } from 'three';

/** @jsx vhtml */

export function Footer () {
  return (
    <footer>
      <a class="item" target="_blank" href="https://threejs.org/">
        three.js r{REVISION}
      </a>
    </footer>
  );
}
