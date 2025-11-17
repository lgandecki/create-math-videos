from manim import *
import numpy as np

class PiRatioAnimation(Scene):
    def construct(self):
        # Title
        title = Text("The Constant π", font_size=48)
        subtitle = Text("Circumference ÷ Diameter = π ≈ 3.14159...", font_size=32, color=BLUE)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))

        # Create initial circle
        initial_radius = 1.2
        circle = Circle(radius=initial_radius, color=BLUE, stroke_width=4)
        circle.shift(UP * 1.5)
        
        # Center dot
        center_dot = Dot(circle.get_center(), color=WHITE, radius=0.06)
        
        # Diameter line
        diameter_line = Line(
            circle.get_center() + LEFT * initial_radius,
            circle.get_center() + RIGHT * initial_radius,
            color=YELLOW,
            stroke_width=3
        )
        
        # Labels for circle
        diameter_label = Text("d", font_size=24, color=YELLOW)
        diameter_label.next_to(diameter_line, DOWN, buff=0.1)
        
        # Show circle with diameter
        self.play(Create(circle))
        self.play(Create(diameter_line), FadeIn(center_dot))
        self.play(Write(diameter_label))
        self.wait(1)

        # Create circumference visualization area
        circ_y_position = DOWN * 1.5
        
        # Function to create unwrapped circumference
        def create_unwrapped_circumference(radius, color=RED):
            length = 2 * PI * radius
            # Center the line horizontally
            line = Line(
                LEFT * length/2 + circ_y_position,
                RIGHT * length/2 + circ_y_position,
                color=color,
                stroke_width=3
            )
            return line
        
        # Function to create diameter reference line
        def create_diameter_reference(radius, y_offset=0.5):
            length = 2 * radius
            # Center the line horizontally
            line = Line(
                LEFT * length/2 + circ_y_position + DOWN * y_offset,
                RIGHT * length/2 + circ_y_position + DOWN * y_offset,
                color=YELLOW,
                stroke_width=3
            )
            return line

        # Animate unwrapping the circumference
        circumference_line = create_unwrapped_circumference(initial_radius)
        diameter_ref = create_diameter_reference(initial_radius)
        
        # Create arc that will "unroll"
        arc = Arc(
            radius=initial_radius,
            start_angle=PI/2,
            angle=2*PI,
            color=RED,
            stroke_width=3
        ).move_to(circle.get_center())
        
        # Animate the unrolling
        self.play(Create(arc))
        self.play(
            Transform(arc, circumference_line),
            run_time=2
        )
        self.play(Create(diameter_ref))
        
        # Labels for the lines
        circ_label = Text("Circumference", font_size=20, color=RED)
        circ_label.next_to(circumference_line, UP, buff=0.1)
        
        diam_label = Text("Diameter", font_size=20, color=YELLOW)
        diam_label.next_to(diameter_ref, DOWN, buff=0.1)
        
        self.play(Write(circ_label), Write(diam_label))
        
        # Show the ratio with dynamic values
        ratio_equation = VGroup()
        
        # Create number displays as text
        circ_value = Text(f"{2 * PI * initial_radius:.3f}", font_size=24, color=RED)
        div_symbol = Text(" ÷ ", font_size=24)
        diam_value = Text(f"{2 * initial_radius:.3f}", font_size=24, color=YELLOW)
        equals = Text(" = ", font_size=24)
        pi_value = Text("3.14159", font_size=24, color=GREEN)
        
        # Arrange equation
        ratio_equation = VGroup(circ_value, div_symbol, diam_value, equals, pi_value)
        ratio_equation.arrange(RIGHT, buff=0.2)
        ratio_equation.to_edge(UP).shift(DOWN * 0.5)
        
        # Labels above the numbers
        circ_label_top = Text("Circumference", font_size=16, color=RED)
        circ_label_top.next_to(circ_value, UP, buff=0.1)
        diam_label_top = Text("Diameter", font_size=16, color=YELLOW)
        diam_label_top.next_to(diam_value, UP, buff=0.1)
        pi_label_top = Text("π", font_size=16, color=GREEN)
        pi_label_top.next_to(pi_value, UP, buff=0.1)
        
        labels_top = VGroup(circ_label_top, diam_label_top, pi_label_top)
        
        self.play(
            Write(ratio_equation),
            Write(labels_top)
        )
        self.wait(1)

        # Now animate circles of different sizes
        radii = [0.6, 0.9, 1.5, 0.4, 1.2]
        
        for new_radius in radii:
            # Update circle
            new_circle = Circle(radius=new_radius, color=BLUE, stroke_width=4)
            new_circle.shift(UP * 1.5)
            
            # Update diameter line
            new_diameter_line = Line(
                new_circle.get_center() + LEFT * new_radius,
                new_circle.get_center() + RIGHT * new_radius,
                color=YELLOW,
                stroke_width=3
            )
            
            # Update unwrapped lines
            new_circumference = create_unwrapped_circumference(new_radius)
            new_diameter_ref = create_diameter_reference(new_radius)
            
            # Calculate new values
            new_circ_val = 2 * PI * new_radius
            new_diam_val = 2 * new_radius
            
            # Create new text objects with updated values
            new_circ_text = Text(f"{new_circ_val:.3f}", font_size=24, color=RED)
            new_diam_text = Text(f"{new_diam_val:.3f}", font_size=24, color=YELLOW)
            
            # Position them at the same location as the old ones
            new_circ_text.move_to(circ_value)
            new_diam_text.move_to(diam_value)
            
            # Animate the transformation with changing numbers
            self.play(
                Transform(circle, new_circle),
                Transform(diameter_line, new_diameter_line),
                Transform(arc, new_circumference),
                Transform(diameter_ref, new_diameter_ref),
                Transform(circ_value, new_circ_text),
                Transform(diam_value, new_diam_text),
                run_time=1.5
            )
            
            # The ratio stays the same - highlight it!
            self.play(
                pi_value.animate.set_color(YELLOW).scale(1.2),
                run_time=0.3
            )
            self.play(
                pi_value.animate.set_color(GREEN).scale(1/1.2),
                run_time=0.3
            )
            
            self.wait(0.5)

        # Show multiple circles simultaneously
        self.play(
            *[FadeOut(mob) for mob in [circle, diameter_line, center_dot, diameter_label,
                                       arc, diameter_ref, circ_label, diam_label]]
        )
        
        # Create multiple circles with their unwrapped circumferences
        multi_circles = VGroup()
        multi_lines = VGroup()
        
        sizes = [0.3, 0.5, 0.7, 0.9]
        x_positions = np.linspace(-5, 5, len(sizes))
        
        for i, (radius, x_pos) in enumerate(zip(sizes, x_positions)):
            # Circle
            circ = Circle(radius=radius, color=BLUE, stroke_width=3)
            circ.shift(RIGHT * x_pos + UP * 2)
            
            # Diameter
            diam = Line(
                circ.get_center() + LEFT * radius,
                circ.get_center() + RIGHT * radius,
                color=YELLOW,
                stroke_width=2
            )
            
            # Calculate positions for lines below each circle
            y_line_pos = -0.5 - i * 0.8
            
            # Circumference line
            circ_length = 2 * PI * radius
            circ_line = Line(
                RIGHT * x_pos + LEFT * circ_length/2 + UP * y_line_pos,
                RIGHT * x_pos + RIGHT * circ_length/2 + UP * y_line_pos,
                color=RED,
                stroke_width=2
            )
            
            # Diameter reference
            diam_ref = Line(
                RIGHT * x_pos + LEFT * radius + UP * (y_line_pos - 0.3),
                RIGHT * x_pos + RIGHT * radius + UP * (y_line_pos - 0.3),
                color=YELLOW,
                stroke_width=2
            )
            
            # Pi markers on the circumference line
            pi_marks = VGroup()
            for j in range(3):
                mark_x = x_pos - circ_length/2 + (j + 1) * 2 * radius
                mark = Line(
                    RIGHT * mark_x + UP * (y_line_pos + 0.1),
                    RIGHT * mark_x + UP * (y_line_pos - 0.1),
                    color=WHITE,
                    stroke_width=1
                )
                pi_marks.add(mark)
            
            # Group elements
            circle_group = VGroup(circ, diam)
            line_group = VGroup(circ_line, diam_ref, pi_marks)
            
            multi_circles.add(circle_group)
            multi_lines.add(line_group)
        
        # Animate all circles appearing
        self.play(
            *[Create(group) for group in multi_circles],
            run_time=2
        )
        
        # Animate all circumferences unwrapping
        self.play(
            *[Create(group) for group in multi_lines],
            run_time=2
        )
        
        # Add pi markers explanation
        pi_explanation = Text("Each diameter fits into the circumference exactly π times", 
                            font_size=24, color=WHITE)
        pi_explanation.to_edge(DOWN).shift(UP * 0.5)
        self.play(Write(pi_explanation))
        
        # Highlight the constant ratio
        final_message = VGroup(
            Text("No matter the size of the circle:", font_size=28),
            Text("Circumference = π × Diameter", font_size=36, color=GREEN),
            Text("π ≈ 3.14159...", font_size=32, color=BLUE)
        ).arrange(DOWN, buff=0.4)
        final_message.move_to(ORIGIN)
        
        # Fade everything except the final message
        self.play(
            *[FadeOut(mob) for mob in self.mobjects],
            run_time=1
        )
        
        self.play(Write(final_message))
    
        
        self.wait(3)