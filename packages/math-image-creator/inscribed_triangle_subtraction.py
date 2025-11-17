from manim import *
import numpy as np

class InscribedTriangleSubtraction(Scene):
    def construct(self):
        # Title
        title = Text("The General Case: Subtraction Method (Conceptual)", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create square with side length 's'
        square = Square(side_length=4, color=BLUE, stroke_width=3)
        square.move_to(ORIGIN)
        
        # Label for square side
        side_label = MathTex("s", font_size=24)
        side_label.next_to(square, DOWN * 0.3 + LEFT * 2)
        
        self.play(Create(square))
        self.play(Write(side_label))
        self.wait(1)
        
        # Create complex inscribed triangle with vertices not aligned with sides
        # Define triangle vertices on the square's perimeter
        v1 = np.array([-2, 1.5, 0])  # Left side, not at corner
        v2 = np.array([1.2, 2, 0])   # Top side, not at corner  
        v3 = np.array([2, -1.8, 0])  # Right side, not at corner
        
        inscribed_triangle = Polygon(v1, v2, v3, 
                                   color=GREEN, 
                                   fill_opacity=0.3,
                                   stroke_width=3)
        
        # Introduction text
        intro_text = Text("For more complex inscribed triangles,", font_size=28)
        intro_text2 = Text("we can use the subtraction method.", font_size=28)
        intro_text.to_edge(DOWN, buff=1.5)
        intro_text2.next_to(intro_text, DOWN, buff=0.3)
        
        self.play(Create(inscribed_triangle))
        self.play(Write(intro_text))
        self.play(Write(intro_text2))
        self.wait(2)
        
        # Remove intro text
        self.play(FadeOut(intro_text), FadeOut(intro_text2))
        
        # Highlight the area of the square
        square_highlight = square.copy()
        square_highlight.set_fill(BLUE, opacity=0.2)
        square_area_text = Text("Area of Square", font_size=24, color=BLUE)
        square_area_text.to_edge(LEFT, buff=0.5).shift(UP * 2)
        
        self.play(FadeIn(square_highlight))
        self.play(Write(square_area_text))
        self.wait(1)
        
        # Create the three corner triangles
        # Triangle 1 (top-left corner)
        t1_vertices = [np.array([-2, 2, 0]), v1, v2]
        triangle1 = Polygon(*t1_vertices, color=RED, fill_opacity=0.4, stroke_width=2)
        
        # Triangle 2 (top-right corner) 
        t2_vertices = [v2, np.array([2, 2, 0]), v3]
        triangle2 = Polygon(*t2_vertices, color=YELLOW, fill_opacity=0.4, stroke_width=2)
        
        # Triangle 3 (bottom-right corner)
        t3_vertices = [v3, np.array([2, -2, 0]), np.array([-2, -2, 0]), v1]
        triangle3 = Polygon(*t3_vertices, color=ORANGE, fill_opacity=0.4, stroke_width=2)
        
        # Labels for triangles
        t1_label = Text("T1", font_size=20, color=RED)
        t1_label.move_to(triangle1.get_center())
        
        t2_label = Text("T2", font_size=20, color=YELLOW) 
        t2_label.move_to(triangle2.get_center())
        
        t3_label = Text("T3", font_size=20, color=ORANGE)
        t3_label.move_to(triangle3.get_center())
        
        # Highlight the three corner triangles
        surrounding_text = Text("Surrounding triangles", font_size=24, color=RED)
        surrounding_text.to_edge(RIGHT, buff=0.5).shift(UP * 2)
        
        self.play(Create(triangle1), Write(t1_label))
        self.wait(0.5)
        self.play(Create(triangle2), Write(t2_label))
        self.wait(0.5)
        self.play(Create(triangle3), Write(t3_label))
        self.play(Write(surrounding_text))
        self.wait(2)
        
        # Explanation text
        method_text = Text("The area of the inscribed triangle is equal to:", font_size=26)
        method_text2 = Text("Area of Square - Sum of surrounding triangles", font_size=26)
        method_text.to_edge(DOWN, buff=1.5)
        method_text2.next_to(method_text, DOWN, buff=0.3)
        
        self.play(Write(method_text))
        self.play(Write(method_text2))
        self.wait(2)
        
        # Remove explanation text and move to formula
        self.play(FadeOut(method_text), FadeOut(method_text2))
        
        # Display the conceptual formula
        formula = MathTex(
            r"\text{Area(Inscribed Triangle)} = \text{Area(Square)} - (\text{Area }T_1 + \text{Area }T_2 + \text{Area }T_3)"
        )
        formula.scale(0.8)
        formula.to_edge(DOWN, buff=1)
        
        self.play(Write(formula))
        self.wait(3)
        
        # Final emphasis on the inscribed triangle
        self.play(
            inscribed_triangle.animate.set_stroke(width=5),
            inscribed_triangle.animate.set_fill(opacity=0.5)
        )
        self.wait(2)
        
        # Final pause
        self.wait(2)