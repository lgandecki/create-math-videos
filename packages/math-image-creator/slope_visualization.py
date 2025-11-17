from manim import *

class SlopeVisualization(Scene):
    def construct(self):
        # Set up coordinate system
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            x_length=10,
            y_length=8,
            axis_config={"color": BLUE},
            tips=False,
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Add axes to scene
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Title
        title = Text("The Slope (m)", font_size=48, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Start with y = x line
        initial_line = axes.plot(lambda x: x, color=YELLOW, x_range=[-4, 4])
        equation = MathTex("y = x", font_size=36, color=WHITE)
        equation.to_corner(UL, buff=1)
        
        self.play(Create(initial_line), Write(equation))
        self.wait(2)
        
        # Transform to y = mx + b format and highlight m
        new_equation = MathTex("y = ", "m", "x", " + b", font_size=36)
        new_equation[1].set_color(RED)  # Highlight 'm' in red
        new_equation.to_corner(UL, buff=1)
        
        self.play(Transform(equation, new_equation))
        self.wait(2)
        
        # Explain what m represents
        explanation = Text("m represents the slope or steepness", font_size=28, color=GREEN)
        explanation.to_edge(DOWN, buff=1.5)
        self.play(Write(explanation))
        self.wait(2)
        
        # Current slope value display
        slope_value = Text("m = 1", font_size=32, color=RED)
        slope_value.to_corner(UR, buff=1)
        self.play(Write(slope_value))
        self.wait(1)
        
        # Animate increasing slope values
        slopes = [2, 3]
        for m in slopes:
            # Update line
            new_line = axes.plot(lambda x: m * x, color=YELLOW, x_range=[-4, 4])
            new_slope_value = Text(f"m = {m}", font_size=32, color=RED)
            new_slope_value.to_corner(UR, buff=1)
            
            self.play(
                Transform(initial_line, new_line),
                Transform(slope_value, new_slope_value)
            )
            self.wait(1.5)
        
        # Update explanation
        steeper_explanation = Text("Larger m values make steeper lines", font_size=28, color=GREEN)
        steeper_explanation.to_edge(DOWN, buff=1.5)
        self.play(Transform(explanation, steeper_explanation))
        self.wait(2)
        
        # Animate decreasing slope values
        slopes = [1, 0.5, 0.1]
        for m in slopes:
            new_line = axes.plot(lambda x: m * x, color=YELLOW, x_range=[-4, 4])
            new_slope_value = Text(f"m = {m}", font_size=32, color=RED)
            new_slope_value.to_corner(UR, buff=1)
            
            self.play(
                Transform(initial_line, new_line),
                Transform(slope_value, new_slope_value)
            )
            self.wait(1.5)
        
        # Update explanation
        flatter_explanation = Text("Smaller m values make flatter lines", font_size=28, color=GREEN)
        flatter_explanation.to_edge(DOWN, buff=1.5)
        self.play(Transform(explanation, flatter_explanation))
        self.wait(2)
        
        # Show horizontal line (m = 0)
        horizontal_line = axes.plot(lambda x: 0, color=YELLOW, x_range=[-4, 4])
        zero_slope_value = Text("m = 0", font_size=32, color=RED)
        zero_slope_value.to_corner(UR, buff=1)
        horizontal_explanation = Text("m = 0 creates a horizontal line", font_size=28, color=GREEN)
        horizontal_explanation.to_edge(DOWN, buff=1.5)
        
        self.play(
            Transform(initial_line, horizontal_line),
            Transform(slope_value, zero_slope_value),
            Transform(explanation, horizontal_explanation)
        )
        self.wait(2)
        
        # Show negative slopes
        negative_slopes = [-1, -2]
        for m in negative_slopes:
            new_line = axes.plot(lambda x: m * x, color=YELLOW, x_range=[-4, 4])
            new_slope_value = Text(f"m = {m}", font_size=32, color=RED)
            new_slope_value.to_corner(UR, buff=1)
            
            self.play(
                Transform(initial_line, new_line),
                Transform(slope_value, new_slope_value)
            )
            self.wait(1.5)
        
        # Update explanation for negative slopes
        negative_explanation = Text("Negative m values create downward-slanting lines", font_size=28, color=GREEN)
        negative_explanation.to_edge(DOWN, buff=1.5)
        self.play(Transform(explanation, negative_explanation))
        self.wait(2)
        
        # Rise over run explanation
        # Reset to m = 1 for demonstration
        demo_line = axes.plot(lambda x: x, color=YELLOW, x_range=[-4, 4])
        demo_slope_value = Text("m = 1", font_size=32, color=RED)
        demo_slope_value.to_corner(UR, buff=1)
        
        self.play(
            Transform(initial_line, demo_line),
            Transform(slope_value, demo_slope_value)
        )
        self.wait(1)
        
        # Show rise over run
        rise_over_run_explanation = Text("m = rise/run (how much y changes per unit of x)", font_size=24, color=GREEN)
        rise_over_run_explanation.to_edge(DOWN, buff=1.5)
        self.play(Transform(explanation, rise_over_run_explanation))
        
        # Draw rise and run arrows
        point1 = axes.c2p(1, 1)
        point2 = axes.c2p(2, 2)
        
        # Run arrow (horizontal)
        run_arrow = Arrow(point1, axes.c2p(2, 1), color=BLUE, buff=0)
        run_label = Text("run = 1", font_size=20, color=BLUE)
        run_label.next_to(run_arrow, DOWN, buff=0.1)
        
        # Rise arrow (vertical)
        rise_arrow = Arrow(axes.c2p(2, 1), point2, color=RED, buff=0)
        rise_label = Text("rise = 1", font_size=20, color=RED)
        rise_label.next_to(rise_arrow, RIGHT, buff=0.1)
        
        self.play(
            Create(run_arrow), Write(run_label),
            Create(rise_arrow), Write(rise_label)
        )
        self.wait(3)
        
        # Final summary
        final_text = Text("Slope (m) determines line steepness and direction", font_size=28, color=WHITE)
        final_text.to_edge(DOWN, buff=0.5)
        self.play(Transform(explanation, final_text))
        self.wait(3)