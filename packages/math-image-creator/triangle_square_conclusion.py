from manim import *

class TriangleSquareConclusion(Scene):
    def construct(self):
        # Title for the conclusion section
        title = Text("Podsumowanie", font_size=48, color=BLUE)
        title.to_edge(UP)
        
        self.play(Write(title))
        self.wait(1)
        
        # First part: Reiterate the two main approaches
        approach_text = Text("Dwa glowne sposoby obliczania:", font_size=36)
        approach_text.next_to(title, DOWN, buff=0.8)
        
        self.play(Write(approach_text))
        self.wait(1)
        
        # List the two approaches
        approach1 = Text("1. Obliczanie przez wspolrzedne wierzcholkow", font_size=28)
        approach1.next_to(approach_text, DOWN, buff=0.5)
        approach1.shift(LEFT * 1)
        
        approach2 = Text("2. Wykorzystanie prostej zaleznosci geometrycznej", font_size=28)
        approach2.next_to(approach1, DOWN, buff=0.3)
        approach2.shift(LEFT * 1)
        
        self.play(Write(approach1))
        self.wait(0.5)
        self.play(Write(approach2))
        self.wait(1.5)
        
        # Clear the screen for the emphasis part
        self.play(FadeOut(approach_text, approach1, approach2))
        
        # Emphasize the most common and straightforward calculation
        emphasis_text = Text("Najprostszy i najczesciej uzywany sposob:", 
                           font_size=36, color=YELLOW)
        emphasis_text.next_to(title, DOWN, buff=0.8)
        
        self.play(Write(emphasis_text))
        self.wait(1)
        
        # Display the square with inscribed triangle
        square = Square(side_length=3, color=BLUE, fill_opacity=0.3)
        square.move_to(ORIGIN)
        
        # Create triangle with base on bottom side and apex on top side
        square_corners = square.get_vertices()
        bottom_left = square_corners[2]  # Bottom left corner
        bottom_right = square_corners[3]  # Bottom right corner
        top_center = (square_corners[0] + square_corners[1]) / 2  # Center of top edge
        
        triangle = Polygon(bottom_left, bottom_right, top_center, 
                         color=GREEN, fill_opacity=0.6)
        
        # Position the diagram
        diagram = VGroup(square, triangle)
        diagram.shift(DOWN * 0.5)
        
        self.play(FadeOut(emphasis_text))
        self.play(Create(square))
        self.wait(0.5)
        self.play(Create(triangle))
        self.wait(1)
        
        # Display the key formula
        formula_text = Text("Kluczowy wzor:", font_size=32, color=YELLOW)
        formula_text.next_to(diagram, DOWN, buff=0.8)
        
        formula = MathTex(r"\text{Pole} = \frac{1}{2} \times s^2", font_size=48)
        formula.next_to(formula_text, DOWN, buff=0.5)
        formula.set_color(RED)
        
        self.play(Write(formula_text))
        self.wait(0.5)
        self.play(Write(formula))
        self.wait(2)
        
        # Clear everything for final statement
        self.play(FadeOut(title, diagram, formula_text, formula))
        
        # Final statement
        final_statement1 = Text("Pole trojkata wpisanego w kwadrat", 
                              font_size=32, color=WHITE)
        final_statement1.move_to(ORIGIN + UP * 0.8)
        
        final_statement2 = Text("z podstawa na jednym boku i wierzcholkiem na przeciwnym", 
                              font_size=32, color=WHITE)
        final_statement2.next_to(final_statement1, DOWN, buff=0.3)
        
        final_statement3 = Text("wynosi polowe pola kwadratu!", 
                              font_size=36, color=YELLOW, weight=BOLD)
        final_statement3.next_to(final_statement2, DOWN, buff=0.5)
        
        self.play(Write(final_statement1))
        self.wait(0.8)
        self.play(Write(final_statement2))
        self.wait(0.8)
        self.play(Write(final_statement3))
        self.wait(3)
        
        # Show the formula one more time as conclusion
        final_formula = MathTex(r"\text{Pole trojkata} = \frac{1}{2} \times \text{Pole kwadratu}", 
                              font_size=40, color=RED)
        final_formula.next_to(final_statement3, DOWN, buff=0.8)
        
        self.play(Write(final_formula))
        self.wait(3)