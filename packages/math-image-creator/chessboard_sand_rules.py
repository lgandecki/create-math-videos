from manim import *

class ChessboardSandRules(Scene):
    def construct(self):
        # Title
        title = Text("Setting the Rules", font_size=48, color=BLUE).to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create 6x6 chessboard
        chessboard = self.create_chessboard()
        chessboard.scale(0.8).move_to(LEFT * 2)
        
        # Present the chessboard
        self.play(FadeIn(chessboard))
        self.wait(1)
        
        # Add square numbers
        square_numbers = self.add_square_numbers(chessboard)
        self.play(FadeIn(square_numbers))
        self.wait(2)
        
        # Introduce the rule
        rule_text = Text("On each square N, we place N² grains of sand", 
                        font_size=24, color=WHITE)
        rule_text.next_to(chessboard, RIGHT, buff=1).shift(UP * 2)
        
        self.play(Write(rule_text))
        self.wait(2)
        
        # Display the formula
        formula = MathTex(r"\text{Grains on Square N} = N^2", 
                         font_size=36, color=YELLOW)
        formula.next_to(rule_text, DOWN, buff=0.8)
        
        self.play(Write(formula))
        self.wait(2)
        
        # Highlight dependency explanation
        dependency_text = Text("The number of grains depends on\nthe square's position", 
                              font_size=20, color=GREEN)
        dependency_text.next_to(formula, DOWN, buff=0.8)
        
        self.play(Write(dependency_text))
        self.wait(1)
        
        # Demonstrate with specific squares
        self.demonstrate_examples(chessboard, square_numbers)
        
        self.wait(3)
    
    def create_chessboard(self):
        squares = VGroup()
        
        for row in range(6):
            for col in range(6):
                # Alternate colors
                if (row + col) % 2 == 0:
                    color = WHITE
                    fill_color = WHITE
                    fill_opacity = 0.8
                else:
                    color = BLACK
                    fill_color = GRAY
                    fill_opacity = 0.8
                
                square = Square(side_length=0.8, color=color, 
                              fill_color=fill_color, fill_opacity=fill_opacity)
                square.move_to(np.array([col * 0.8, row * 0.8, 0]))
                squares.add(square)
        
        return squares
    
    def add_square_numbers(self, chessboard):
        numbers = VGroup()
        
        for row in range(6):
            for col in range(6):
                # Calculate square number (1-36, starting from bottom-left)
                square_num = (5 - row) * 6 + col + 1
                
                # Determine text color based on square color
                if (row + col) % 2 == 0:
                    text_color = BLACK
                else:
                    text_color = WHITE
                
                number_text = Text(str(square_num), font_size=16, color=text_color)
                number_text.move_to(np.array([col * 0.8, row * 0.8, 0]))
                numbers.add(number_text)
        
        return numbers
    
    def demonstrate_examples(self, chessboard, square_numbers):
        # Highlight square 1
        square_1_highlight = Square(side_length=0.85, color=RED, fill_opacity=0)
        square_1_highlight.set_stroke(width=4)
        square_1_highlight.move_to(np.array([0 * 0.8, 5 * 0.8, 0]))  # Bottom-left
        
        example_1 = Text("Square 1: 1² = 1 grain", font_size=20, color=RED)
        example_1.next_to(chessboard, RIGHT, buff=2).shift(DOWN * 1)
        
        self.play(Create(square_1_highlight), Write(example_1))
        self.wait(2)
        
        # Highlight square 6
        square_6_highlight = Square(side_length=0.85, color=BLUE, fill_opacity=0)
        square_6_highlight.set_stroke(width=4)
        square_6_highlight.move_to(np.array([5 * 0.8, 5 * 0.8, 0]))  # Bottom-right
        
        example_6 = Text("Square 6: 6² = 36 grains", font_size=20, color=BLUE)
        example_6.next_to(example_1, DOWN, buff=0.3)
        
        self.play(Create(square_6_highlight), Write(example_6))
        self.wait(2)
        
        # Highlight square 36
        square_36_highlight = Square(side_length=0.85, color=GREEN, fill_opacity=0)
        square_36_highlight.set_stroke(width=4)
        square_36_highlight.move_to(np.array([5 * 0.8, 0 * 0.8, 0]))  # Top-right
        
        example_36 = Text("Square 36: 36² = 1,296 grains", font_size=20, color=GREEN)
        example_36.next_to(example_6, DOWN, buff=0.3)
        
        self.play(Create(square_36_highlight), Write(example_36))
        self.wait(2)
        
        # Remove highlights
        self.play(FadeOut(square_1_highlight), FadeOut(square_6_highlight), 
                 FadeOut(square_36_highlight), FadeOut(example_1), 
                 FadeOut(example_6), FadeOut(example_36))