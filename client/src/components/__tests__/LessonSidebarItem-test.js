// @flow

import React from "react";
import LessonSidebarItem from "../LessonSidebarItem";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import test from "ava";

test.skip("URL changes when admin", t => {
  let component = renderer.create(
    <MemoryRouter>
      <LessonSidebarItem id="testId" title="Test Lesson" />
    </MemoryRouter>
  );

  let tree = component.toJSON();
  t.snapshot(tree);

  component = renderer.create(
    <MemoryRouter>
      <LessonSidebarItem id="testId" title="Test Lesson" admin={true} />
    </MemoryRouter>
  );
  tree = component.toJSON();
  t.snapshot(tree);
});
