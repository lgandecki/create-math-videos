from manim import *

class PiConstantScene(Scene):
    def construct(self):
        # Introduction
        title = Text("The Constant π", font_size=72)
        subtitle = Text("Circumference ÷ Diameter = π", font_size=36).next_to(title, DOWN)
        self.play(Write(title), Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))

        # Unwrapping a Circle
        # ValueTracker for radius
        radius_tracker = ValueTracker(1)

        # Circle with diameter line and label
        circle = always_redraw(lambda: Circle(radius=radius_tracker.get_value(), color=BLUE))
        diameter_line = always_redraw(lambda: Line(
            start=circle.get_center() + LEFT * radius_tracker.get_value(),
            end=circle.get_center() + RIGHT * radius_tracker.get_value(),
            color=YELLOW
        ))
        diameter_label = always_redraw(lambda: MathTex("d").next_to(diameter_line, UP))

        # Unrolled circumference and diameter lines
        circumference_line = always_redraw(lambda: Line(
            start=LEFT * (radius_tracker.get_value() * PI),
            end=RIGHT * (radius_tracker.get_value() * PI),
            color=RED
        ).to_edge(DOWN, buff=1))
        diameter_line_unrolled = always_redraw(lambda: Line(
            start=LEFT * radius_tracker.get_value(),
            end=RIGHT * radius_tracker.get_value(),
            color=YELLOW
        ).next_to(circumference_line, DOWN, buff=0.5))

        # Equation display
        eq = always_redraw(lambda: MathTex(
            f"{{2\pi {radius_tracker.get_value():.2f}}} \over {{2 {radius_tracker.get_value():.2f}}} = 3.14159..."
        ).to_edge(UP))

        self.play(Create(circle), Create(diameter_line), Write(diameter_label))
        self.play(Write(eq))
        self.wait(1)

        # Animate unrolling
        self.play(Transform(circle, circumference_line), run_time=2)
        self.play(Create(circumference_line), Create(diameter_line_unrolled))
        self.wait(2)

        # Animate resizing circle and updating
        for new_radius in [0.5, 2, 1.5, 1]:
            self.play(radius_tracker.animate.set_value(new_radius), run_time=2)
            self.wait(1)

        # All Circles, One Rule
        self.play(FadeOut(eq), FadeOut(circle), FadeOut(diameter_line), FadeOut(diameter_label), FadeOut(circumference_line), FadeOut(diameter_line_unrolled))
        self.wait()

        radii = [0.5, 1, 1.5, 2]
        circles = VGroup(*[Circle(radius=r, color=BLUE).shift(LEFT*6 + RIGHT*4*i) for i, r in enumerate(radii)])
        self.play(Create(circles))

        # Unroll each circumference
        lines = VGroup(*[
            Line(start=LEFT*(r*PI), end=RIGHT*(r*PI), color=RED)
            .next_to(circles[i], DOWN, buff=0.5)
            for i, r in enumerate(radii)
        ])
        diam_lines = VGroup(*[
            Line(start=LEFT*r, end=RIGHT*r, color=YELLOW)
            .next_to(lines[i], DOWN, buff=0.2)
            for i, r in enumerate(radii)
        ])
        self.play(Create(lines), Create(diam_lines))

        # Tick marks on circumference
        for i, r in enumerate(radii):
            circ_len = 2 * PI * r
            diam_len = 2 * r
            n_ticks = int(circ_len // diam_len) + 1
            for k in range(n_ticks):
                pos = lines[i].point_from_proportion((diam_len * k) / circ_len)
                tick = Line(UP * 0.1, DOWN * 0.1).move_to(pos)
                self.add(tick)
        self.wait(1)

        bottom_text = Text("Each diameter fits into the circumference exactly π times", font_size=24)
        self.play(Write(bottom_text.to_edge(DOWN)))
        self.wait(3)

        # Conclusion
        self.play(FadeOut(circles), FadeOut(lines), FadeOut(diam_lines), FadeOut(bottom_text))
        conclusion = VGroup(
            Text("No matter the size of the circle:", font_size=36),
            MathTex("C = \pi \times d", font_size=48),
            Text("π ≈ 3.14159...", font_size=36)
        ).arrange(DOWN, buff=0.5)
        self.play(Write(conclusion))
        self.wait(3)

