import React from "react";
import LessonSidebarItem from "../LessonSidebarItem";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";

test("URL changes when admin", () => {
  let component = renderer.create(
    <MemoryRouter>
      <LessonSidebarItem id="testId" title="Test Lesson" />
    </MemoryRouter>
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <MemoryRouter>
      <LessonSidebarItem id="testId" title="Test Lesson" admin={true} />
    </MemoryRouter>
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
