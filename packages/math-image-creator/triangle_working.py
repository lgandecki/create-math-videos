from manim import *

class TriangleWorking(Scene):
    def construct(self):
        # Create the square
        square = Square(side_length=3, color=BLUE, stroke_width=3, fill_opacity=0.1)
        side_label = MathTex("s", color=BLUE, font_size=48)
        side_label.next_to(square, DOWN)
        
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle with base on bottom side
        bl = square.get_corner(DL)
        br = square.get_corner(DR)
        top = square.get_top()
        
        triangle = Polygon(bl, br, top, color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Create(triangle))
        self.wait(1)
        
        # Show area formula
        formula = MathTex(r"Area = \frac{1}{2} s^2", font_size=36, color=YELLOW)
        formula.to_edge(UP)
        self.play(Write(formula))
        self.wait(1)
        
        # Show base and height measurements
        base_line = Line(bl, br, color=RED, stroke_width=5)
        # Position height line in the middle of the triangle
        height_line_x = square.get_center()[0]
        height_line = Line([height_line_x, bl[1], 0], [height_line_x, top[1], 0], color=RED, stroke_width=5)
        
        # Only create height label, skip base label to avoid overlap with blue s
        height_s = MathTex("s", color=RED, font_size=36)
        height_s.next_to(height_line, RIGHT)
        
        self.play(Create(base_line))
        self.wait(1)
        self.play(Create(height_line), Write(height_s))
        self.wait(2)
        
        # Remove measurement indicators
        self.play(FadeOut(base_line), FadeOut(height_line), 
                 FadeOut(height_s))
        
        # Animate sliding triangle
        for i in range(5):
            # Move apex across top edge
            progress = i / 4.0
            apex_x = square.get_left()[0] + progress * 3
            new_apex = [apex_x, top[1], 0]
            new_triangle = Polygon(bl, br, new_apex, 
                                  color=GREEN, fill_opacity=0.3, stroke_width=3)
            self.play(Transform(triangle, new_triangle), run_time=0.8)
        
        # Return to center
        center_triangle = Polygon(bl, br, top, color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Transform(triangle, center_triangle))
        self.wait(1)
        
        # Show s = 6 inside the square
        s_value = MathTex("s = 6", font_size=32, color=WHITE)
        s_value.move_to(square.get_center())
        self.play(Write(s_value))
        self.wait(1)
        
        # Show numerical calculation
        calculation = MathTex(r"Area = \frac{1}{2} \times 6^2 = \frac{1}{2} \times 36 = 18", 
                         font_size=28, color=WHITE)
        calculation.to_edge(DOWN)
        self.play(Write(calculation))
        self.wait(3)