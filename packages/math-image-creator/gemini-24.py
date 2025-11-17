# To run this script, save it as a .py file and execute:
# manim -pql <filename>.py PiConstantVideo

from manim import *
import math

class PiConstantVideo(Scene):
    def construct(self):
        # -----------------------------------------------------------------
        ## Section 1: Introduction
        # -----------------------------------------------------------------
        self.next_section("Introduction", skip_animations=False)

        # Display the title and the core idea
        title = Text("The Constant π", font_size=60).to_edge(UP)
        formula = Tex("Circumference ÷ Diameter = π", font_size=48).next_to(title, DOWN, buff=0.5)

        self.play(Write(title))
        self.play(FadeIn(formula, shift=DOWN))
        self.wait(2)

        self.play(FadeOut(title), FadeOut(formula))
        self.wait(0.5)

        # -----------------------------------------------------------------
        ## Section 2: Unwrapping a Circle
        # -----------------------------------------------------------------
        self.next_section("Unwrapping a Circle", skip_animations=False)

        # Create a ValueTracker to dynamically change the circle's radius
        r_tracker = ValueTracker(1.5)

        # Create the top equation that will update dynamically
        equation = MathTex(
            "\\text{Circumference}", "\\div", "\\text{Diameter}", "=", "\\pi"
        ).to_edge(UP)

        # Add updaters to all elements to make them resize together
        circle = always_redraw(
            lambda: Circle(radius=r_tracker.get_value(), color=BLUE, stroke_width=6)
        )
        
        diameter = always_redraw(
            lambda: Line(
                circle.get_left(), circle.get_right(), color=YELLOW, stroke_width=6
            )
        )

        d_label = always_redraw(
            lambda: MathTex("d", color=YELLOW).next_to(diameter, DOWN, buff=0.2)
        )

        # Group circle and its diameter for positioning
        circle_group = VGroup(circle, diameter, d_label).shift(DOWN * 0.5)

        # Unrolled circumference and diameter for comparison
        unrolled_circumference = always_redraw(
            lambda: Line(
                LEFT * (math.pi * r_tracker.get_value()) / 2,
                RIGHT * (math.pi * r_tracker.get_value()) / 2,
                color=RED,
                stroke_width=6
            ).next_to(circle_group, DOWN, buff=1.0)
        )
        
        diameter_comparison = always_redraw(
            lambda: Line(
                unrolled_circumference.get_left(),
                unrolled_circumference.get_left() + diameter.get_length() * RIGHT,
                color=YELLOW,
                stroke_width=6
            ).next_to(unrolled_circumference, DOWN, buff=0.2)
        )
        
        # Show the circle and its diameter
        self.play(Create(circle), Create(diameter), Write(d_label))
        self.wait(1)

        # Animate the "unrolling" by transforming the circumference into a line
        circumference_path = Circle(radius=r_tracker.get_value(), color=RED, stroke_width=6).rotate(PI/2)
        circumference_path.move_to(circle) # Ensure it's in the same position
        
        self.play(
            Transform(circumference_path, unrolled_circumference),
            run_time=2
        )
        self.play(Create(diameter_comparison))
        self.wait(1)
        
        # Add the equation with updating numbers
        # This part replaces the text placeholders with updating decimal numbers
        eq_circ_val = always_redraw(lambda: DecimalNumber(2 * PI * r_tracker.get_value()).set_color(RED))
        eq_div = MathTex("\\div").set_color(WHITE)
        eq_diam_val = always_redraw(lambda: DecimalNumber(2 * r_tracker.get_value()).set_color(YELLOW))
        eq_equal = MathTex("=").set_color(WHITE)
        eq_pi = MathTex("\\approx 3.14159...").set_color(GREEN)
        
        live_equation = VGroup(eq_circ_val, eq_div, eq_diam_val, eq_equal, eq_pi).arrange(RIGHT).to_edge(UP)
        
        self.play(Write(live_equation))
        self.wait(1.5)

        # Animate the circle resizing and show the ratio remains constant
        self.play(r_tracker.animate.set_value(2.0), run_time=3)
        self.play(Indicate(eq_pi, color=GREEN, scale_factor=1.2))
        self.wait(1)

        self.play(r_tracker.animate.set_value(1.0), run_time=3)
        self.play(Indicate(eq_pi, color=GREEN, scale_factor=1.2))
        self.wait(2)
        
        # Clear the screen for the next section
        self.play(
            FadeOut(circle_group), FadeOut(circumference_path), 
            FadeOut(diameter_comparison), FadeOut(live_equation)
        )
        self.wait(0.5)

        # -----------------------------------------------------------------
        ## Section 3: All Circles, One Rule
        # -----------------------------------------------------------------
        self.next_section("All Circles, One Rule", skip_animations=False)

        radii = [0.5, 0.75, 1.0, 1.25]
        circles = VGroup(*[Circle(radius=r, color=BLUE) for r in radii])
        circles.arrange(RIGHT, buff=0.7).to_edge(UP, buff=1.5)
        
        self.play(Create(circles))
        self.wait(1)

        # Unroll all circumferences simultaneously
        unrolled_lines = VGroup()
        animations = []
        for c in circles:
            line = Line(
                LEFT * c.get_arc_length() / 2,
                RIGHT * c.get_arc_length() / 2,
                color=RED
            ).next_to(c, DOWN, buff=0.5)
            unrolled_lines.add(line)
            
            path_copy = c.copy().set_color(RED)
            animations.append(Transform(path_copy, line))

        self.play(AnimationGroup(*animations, lag_ratio=0.2, run_time=2))

        # Show the diameter fitting into the circumference ~3.14 times
        tick_animations = []
        for i, c in enumerate(circles):
            diameter_len = 2 * c.radius
            line = unrolled_lines[i]
            # Create 3 tick marks
            ticks = VGroup()
            for j in range(1, 4): # 1, 2, 3
                pos = line.get_left() + (RIGHT * diameter_len * j)
                if pos[0] < line.get_right()[0]: # Only draw if it fits
                    tick = Line(UP * 0.1, DOWN * 0.1, color=YELLOW).move_to(pos)
                    ticks.add(tick)
            tick_animations.append(Create(ticks))
        
        self.play(AnimationGroup(*tick_animations, lag_ratio=0.5))
        self.wait(1)
        
        # Add explanatory text
        bottom_text = Text("Each diameter fits into the circumference exactly π times", font_size=36)
        bottom_text.to_edge(DOWN)
        self.play(Write(bottom_text))
        self.wait(3)

        self.play(FadeOut(circles), FadeOut(unrolled_lines), FadeOut(VGroup(*self.mobjects)), FadeOut(bottom_text))
        self.wait(0.5)

        # -----------------------------------------------------------------
        ## Section 4: Conclusion
        # -----------------------------------------------------------------
        self.next_section("Conclusion", skip_animations=False)

        # Display the final summary message
        final_text_1 = Text("No matter the size of the circle:", font_size=42)
        final_text_2 = Tex("Circumference = π × Diameter", font_size=48).set_color(BLUE_C)
        final_text_3 = Tex("π ≈ 3.14159...", font_size=48).set_color(GREEN)
        
        conclusion_group = VGroup(final_text_1, final_text_2, final_text_3).arrange(DOWN, buff=0.7)
        
        self.play(Write(conclusion_group))
        self.wait(5)
        self.play(FadeOut(conclusion_group))
        self.wait(1)
