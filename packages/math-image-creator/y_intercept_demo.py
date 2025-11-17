from manim import *

class YInterceptDemo(Scene):
    def construct(self):
        # Create coordinate plane
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-3, 5, 1],
            x_length=10,
            y_length=8,
            axis_config={"color": BLUE},
            x_axis_config={"numbers_to_include": np.arange(-4, 5, 1)},
            y_axis_config={"numbers_to_include": np.arange(-2, 5, 1)},
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Display coordinate plane
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Create title
        title = Text("The Y-intercept (b)", font_size=36, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Draw initial line y = x (m=1, b=0)
        initial_line = axes.plot(lambda x: x, color=GREEN, x_range=[-4, 4])
        
        # Create equation text
        equation = MathTex("y = mx + b", font_size=32).to_corner(UR)
        equation_values = MathTex("y = 1x + 0", font_size=32, color=GREEN).next_to(equation, DOWN)
        
        self.play(Create(initial_line))
        self.play(Write(equation))
        self.play(Write(equation_values))
        self.wait(2)
        
        # Highlight the y-intercept point (0, 0)
        y_intercept_point = Dot(axes.c2p(0, 0), color=YELLOW, radius=0.1)
        y_intercept_label = Text("y-intercept", font_size=24, color=YELLOW)
        y_intercept_label.next_to(y_intercept_point, RIGHT)
        
        self.play(Create(y_intercept_point), Write(y_intercept_label))
        self.wait(2)
        
        # Highlight the '+b' part of the equation
        b_highlight = Rectangle(
            width=0.5, height=0.4,
            color=YELLOW,
            stroke_width=3,
            fill_opacity=0
        ).move_to(equation_values[0][-1])  # Position around the 'b' (which is '0')
        
        self.play(Create(b_highlight))
        self.wait(1)
        
        # Change b to +2
        new_equation_2 = MathTex("y = 1x + 2", font_size=32, color=RED).move_to(equation_values)
        new_line_2 = axes.plot(lambda x: x + 2, color=RED, x_range=[-4, 2])
        new_y_intercept_2 = Dot(axes.c2p(0, 2), color=YELLOW, radius=0.1)
        new_y_intercept_label_2 = Text("y-intercept = 2", font_size=24, color=YELLOW)
        new_y_intercept_label_2.next_to(new_y_intercept_2, RIGHT)
        
        # Move b highlight to new position
        new_b_highlight = Rectangle(
            width=0.5, height=0.4,
            color=YELLOW,
            stroke_width=3,
            fill_opacity=0
        ).move_to(new_equation_2[0][-1])
        
        self.play(
            Transform(initial_line, new_line_2),
            Transform(equation_values, new_equation_2),
            Transform(y_intercept_point, new_y_intercept_2),
            Transform(y_intercept_label, new_y_intercept_label_2),
            Transform(b_highlight, new_b_highlight)
        )
        self.wait(2)
        
        # Add explanation text
        explanation_1 = Text("The line slides up when b is positive", font_size=24, color=WHITE)
        explanation_1.to_edge(DOWN, buff=1.5)
        self.play(Write(explanation_1))
        self.wait(2)
        
        # Change b to -1
        new_equation_neg1 = MathTex("y = 1x - 1", font_size=32, color=PURPLE).move_to(equation_values)
        new_line_neg1 = axes.plot(lambda x: x - 1, color=PURPLE, x_range=[-3, 4])
        new_y_intercept_neg1 = Dot(axes.c2p(0, -1), color=YELLOW, radius=0.1)
        new_y_intercept_label_neg1 = Text("y-intercept = -1", font_size=24, color=YELLOW)
        new_y_intercept_label_neg1.next_to(new_y_intercept_neg1, RIGHT)
        
        new_b_highlight_neg1 = Rectangle(
            width=0.8, height=0.4,
            color=YELLOW,
            stroke_width=3,
            fill_opacity=0
        ).move_to(new_equation_neg1[0][-2:])  # Position around '- 1'
        
        self.play(
            Transform(initial_line, new_line_neg1),
            Transform(equation_values, new_equation_neg1),
            Transform(y_intercept_point, new_y_intercept_neg1),
            Transform(y_intercept_label, new_y_intercept_label_neg1),
            Transform(b_highlight, new_b_highlight_neg1)
        )
        
        # Update explanation
        explanation_2 = Text("The line slides down when b is negative", font_size=24, color=WHITE)
        explanation_2.to_edge(DOWN, buff=1.5)
        self.play(Transform(explanation_1, explanation_2))
        self.wait(2)
        
        # Final explanation
        final_explanation = VGroup(
            Text("'b' is the y-intercept:", font_size=28, color=WHITE),
            Text("the point where the line crosses the y-axis", font_size=24, color=WHITE)
        ).arrange(DOWN, buff=0.3).to_edge(DOWN, buff=1)
        
        self.play(Transform(explanation_1, final_explanation))
        self.wait(3)
        
        # Show all three lines together for comparison
        original_line = axes.plot(lambda x: x, color=GREEN, x_range=[-4, 4])
        line_plus_2 = axes.plot(lambda x: x + 2, color=RED, x_range=[-4, 2])
        line_minus_1 = axes.plot(lambda x: x - 1, color=PURPLE, x_range=[-3, 4])
        
        comparison_equations = VGroup(
            MathTex("y = x", font_size=24, color=GREEN),
            MathTex("y = x + 2", font_size=24, color=RED),
            MathTex("y = x - 1", font_size=24, color=PURPLE)
        ).arrange(DOWN, buff=0.3).to_corner(UL, buff=1)
        
        self.play(
            Create(original_line),
            Create(line_plus_2),
            initial_line.animate.set_color(PURPLE),
            Write(comparison_equations)
        )
        
        self.wait(4)