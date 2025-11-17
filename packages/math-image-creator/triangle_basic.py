from manim import *

class TriangleBasic(Scene):
    def construct(self):
        # Create the square
        square = Square(side_length=3, color=BLUE, stroke_width=3, fill_opacity=0.1)
        
        # Create side length label
        side_label = MathTex("s", color=BLUE, font_size=48)
        side_label.next_to(square, DOWN, buff=0.3)
        
        # Display square
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle inside the square
        bottom_left = square.get_corner(DL)
        bottom_right = square.get_corner(DR)
        top_center = square.get_top()
        
        triangle = Polygon(bottom_left, bottom_right, top_center, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Show area formula
        formula = MathTex(r"Area = \frac{1}{2} s^2", font_size=48, color=YELLOW)
        formula.to_edge(UP)
        
        self.play(Write(formula))
        self.wait(2)
        
        # Animate sliding triangle
        for i in range(3):
            # Create new triangle with different apex position
            apex_x = -1 + i * 1  # Move apex from left to right
            new_apex = [apex_x, top_center[1], 0]
            new_triangle = Polygon(bottom_left, bottom_right, new_apex, 
                                  color=GREEN, fill_opacity=0.3, stroke_width=3)
            self.play(Transform(triangle, new_triangle), run_time=1)
        
        # Return to center
        center_triangle = Polygon(bottom_left, bottom_right, top_center, 
                                 color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Transform(triangle, center_triangle))
        self.wait(2)